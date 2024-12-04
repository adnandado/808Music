using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.UserArtistEndpoints
{
    public class UserArtistRemoveEndpoint(ApplicationDbContext db, TokenProvider tp) : MyEndpointBaseAsync.WithRequest<UserArtistRemoveRequest>.WithActionResult
    {
        [Authorize]
        [HttpDelete]
        public override async Task<ActionResult> HandleAsync([FromBody] UserArtistRemoveRequest request, CancellationToken cancellationToken = default)
        {
            int userId = int.Parse(tp.GetJwtSub(Request));

            UserArtist? uaCheck = await db.UserArtists.FirstOrDefaultAsync(x => x.ArtistId == request.ArtistId && x.MyAppUserId == userId && x.IsUserOwner, cancellationToken);

            if (uaCheck == null)
            {
                return Unauthorized();
            }

            UserArtist? ua = await db.UserArtists.FirstOrDefaultAsync(x => x.ArtistId == request.ArtistId && x.MyAppUserId == request.UserId, cancellationToken);
            if (ua == null)
            {
                return BadRequest("Users role in managing this artist not found");
            }

            db.UserArtists.Remove(ua);
            await db.SaveChangesAsync(cancellationToken);
            return Ok("User removed from artist profile");
        }
    }

    public class UserArtistRemoveRequest
    {
        public int UserId { get; set; }
        public int ArtistId { get; set; }
    }
}
