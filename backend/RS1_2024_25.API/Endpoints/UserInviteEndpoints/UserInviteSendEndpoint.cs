using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Services;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Services.Interfaces;
using RS1_2024_25.API.Data.Models.Mail;
using System.Text;

namespace RS1_2024_25.API.Endpoints.UserInviteEndpoints
{
    public class UserInviteSendEndpoint(ApplicationDbContext db, TokenProvider tp, IMyMailService ms, IConfiguration cfg) : MyEndpointBaseAsync.WithRequest<UserInviteSendRequest>.WithActionResult
    {
        [Authorize]
        [HttpPost]
        public override async Task<ActionResult> HandleAsync([FromBody] UserInviteSendRequest request, CancellationToken cancellationToken = default)
        {
            bool isAllowedToInvite = tp.AuthorizeUserArtist(Request, request.ArtistId, ["Owner"]);
            if(!isAllowedToInvite)
            {
                return Unauthorized();
            }

            UserArtist? check = await db.UserArtists.Where(ua => ua.ArtistId == request.ArtistId && ua.MyAppUserId == request.MyAppUserId).FirstOrDefaultAsync(cancellationToken);
            var myAppUser = await db.MyAppUsers.FindAsync(request.MyAppUserId);
            var artist = await db.Artists.FindAsync(request.ArtistId);
            var role = await db.UserArtistRoles.FindAsync(request.RoleId);
            if(check != null || myAppUser == null || artist == null || role == null)
            {
                return BadRequest();
            }

            string username = tp.GetJwtClaimValue(Request, "Username");

            MyUserArtistInvite invite = new MyUserArtistInvite
            {
                ArtistId = request.ArtistId,
                MyAppUserId = request.MyAppUserId,
                RoleId = request.RoleId,
                ExpiryDate = DateTime.Now.AddDays(30),
                Token = tp.GenerateReferralCode()
            };

            db.MyUserArtistInvites.Add(invite);
            await db.SaveChangesAsync();

            var mailBody = new StringBuilder();
            mailBody.Append($"Hi {myAppUser.Username},\n\n");
            mailBody.Append($"You have been invited to join artist profile \"{artist.Name}\" as a {role.RoleName} by {username}.\n");
            mailBody.Append($"Click the link to join or join with code \"{invite.Token}\" on the artist profile select page. \n");
            mailBody.Append($"{cfg["FrontendUrl"]}/artist/join?code={invite.Token}\n");
            mailBody.Append($"Invite is valid for the next 30 days.\n\n");
            mailBody.Append($"808 Music");

            await ms.Send(new MailData()
            {
                Subject = $"{username} has invited you to join {artist.Name} - 808 Music",
                IsBodyHtml = false,
                To = myAppUser.Email,
                Body = mailBody
            });

            return Ok($"Successfully invited {myAppUser.Username} to artist profile");
        }
    }

    public class UserInviteSendRequest
    {
        public int RoleId { get; set; }
        public int ArtistId { get; set; }
        public int MyAppUserId { get; set; }
    }
}
