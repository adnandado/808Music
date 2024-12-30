using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.FollowEndpoints
{
    public class FollowOrUnfollowEndpoint(ApplicationDbContext db, TokenProvider tp) : MyEndpointBaseAsync.WithRequest<int>.WithActionResult
    {
        [Authorize]
        [HttpPost("{id}")]
        public override async Task<ActionResult> HandleAsync(int id, CancellationToken cancellationToken = default)
        {
            int userId = int.Parse(tp.GetJwtSub(Request));

            Artist? artist = await db.Artists.FindAsync(id);
            if (artist == null)
            {
                return BadRequest();
            }

            Follow? check = await db.Follows.Where(f => f.MyAppUserId == userId && f.ArtistId == id).FirstOrDefaultAsync();
            if (check != null)
            {
                db.Follows.Remove(check);
                artist.Followers--;
                if (artist.Followers < 0)
                {
                    artist.Followers = 0;
                }
                await db.SaveChangesAsync(cancellationToken);
                return Ok("Unfollowed");
            }

            Follow follow = new Follow
            {
                MyAppUserId = userId,
                ArtistId = id,
                StartedFollowing = DateTime.Now,
                WantsNotifications = false,
            };
            db.Follows.Add(follow);
            artist.Followers++;
            await db.SaveChangesAsync(cancellationToken);
            return Ok("Followed");
        }
    }
}
