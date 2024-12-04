using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.UserArtistEndpoints
{
    public class UserArtistAddOrUpdateRoleEndpoint(ApplicationDbContext db, TokenProvider tp) : MyEndpointBaseAsync.WithRequest<UserArtistAddRequest>.WithActionResult<UserArtistAddResponse>
    {
        [Authorize]
        [HttpPost]
        public override async Task<ActionResult<UserArtistAddResponse>> HandleAsync(UserArtistAddRequest request, CancellationToken cancellationToken = default)
        {
            int userId = int.Parse(tp.GetJwtSub(Request));

            UserArtist? uaCheck = await db.UserArtists.FirstOrDefaultAsync(x => x.ArtistId == request.ArtistId && x.MyAppUserId == userId && x.IsUserOwner, cancellationToken);

            if (uaCheck == null)
            {
                return Unauthorized();
            }

            UserArtist? ua = await db.UserArtists.FirstOrDefaultAsync(x => x.ArtistId == request.ArtistId && x.MyAppUserId == request.AddUserId, cancellationToken);
            if(ua == null)
            {
                ua = new UserArtist();
                await db.UserArtists.AddAsync(ua);
            }

            UserArtistRole? uar = await db.UserArtistRoles.FindAsync(request.RoleId, cancellationToken);
            if(uar == null)
            {
                return BadRequest("Role not found");
            }

            ua.ArtistId = request.ArtistId;
            ua.MyAppUserId = request.AddUserId;
            ua.RoleId = request.RoleId;

            MyAppUser user = await db.MyAppUsers.FindAsync(request.AddUserId, cancellationToken);
            if (user == null)
            {
                return BadRequest("User not found");
            }

            await db.SaveChangesAsync();

            var response = new UserArtistAddResponse
            {
                Role = uar.RoleName,
                Username = user.Username
            };
            return Ok(response);
        }
    }

    public class UserArtistAddRequest
    {
        public int ArtistId { get; set; }
        public int RoleId { get; set; }
        public int AddUserId { get; set; }
    }

    public class UserArtistAddResponse
    {
        public string Username { get; set; }
        public string Role { get; set; }
    }
}
