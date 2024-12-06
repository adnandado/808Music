using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.UserArtistEndpoints
{
    public class UserLeaveArtistEndpoint(ApplicationDbContext db, TokenProvider tp) : MyEndpointBaseAsync.WithRequest<int>.WithActionResult
    {
        [Authorize]
        [HttpDelete("{id}")]
        public override async Task<ActionResult> HandleAsync(int id, CancellationToken cancellationToken = default)
        {
            int userId = int.Parse(tp.GetJwtSub(Request));

            UserArtist? ua = await db.UserArtists.FirstOrDefaultAsync(x => x.ArtistId == id && x.MyAppUserId == userId && !x.IsUserOwner, cancellationToken);
            if (ua == null)
            {
                return BadRequest("Users role in managing this artist not found");
            }

            db.UserArtists.Remove(ua);
            await db.SaveChangesAsync(cancellationToken);
            return Ok("Removed yourself from artist profile");
        }
    }
}
