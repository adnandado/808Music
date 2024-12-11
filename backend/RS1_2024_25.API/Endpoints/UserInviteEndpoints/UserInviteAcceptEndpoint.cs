using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Endpoints.UserArtistEndpoints;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.UserInviteEndpoints
{
    public class UserInviteAcceptEndpoint(ApplicationDbContext db, TokenProvider tp, IConfiguration cfg) : MyEndpointBaseAsync.WithRequest<UserInviteAcceptRequest>.WithActionResult
    {
        [Authorize]
        [HttpPost]
        public override async Task<ActionResult> HandleAsync([FromBody] UserInviteAcceptRequest request, CancellationToken cancellationToken = default)
        {
            int userId = int.Parse(tp.GetJwtSub(Request));

            MyUserArtistInvite? invite = await db.MyUserArtistInvites.Where(i => i.Token == request.InviteToken && i.MyAppUserId == userId).FirstOrDefaultAsync(cancellationToken);

            if(invite == null)
            {
                return BadRequest();
            }

            if(invite.ExpiryDate < DateTime.Now)
            {
                db.MyUserArtistInvites.Remove(invite);
                await db.SaveChangesAsync(cancellationToken);
                return BadRequest("This invite has expired");
            }

            UserArtist? check = await db.UserArtists.Where(userA => userA.MyAppUserId == userId && userA.ArtistId == invite.ArtistId).FirstOrDefaultAsync(cancellationToken);
            if(check != null)
            {
                return BadRequest("Already part of this profile");
            }

            UserArtist ua = new UserArtist
            {
                ArtistId = invite.ArtistId,
                IsUserOwner = false,
                RoleId = invite.RoleId,
                MyAppUserId = userId,
            };

            db.UserArtists.Add(ua);
            db.MyUserArtistInvites.Remove(invite);
            await db.SaveChangesAsync(cancellationToken);
            return Ok($"Successfully joined artist profile!");
        }
    }

    public class UserInviteAcceptRequest
    {
        public string InviteToken { get; set; }
    }
}
