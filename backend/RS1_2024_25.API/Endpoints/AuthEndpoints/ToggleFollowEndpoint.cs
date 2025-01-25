using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace RS1_2024_25.API.Endpoints.FollowEndpoints
{
    [ApiController]
    [Route("api/follow")]
    public class ToggleFollowEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public ToggleFollowEndpoint(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpPost]
        public async Task<ActionResult> ToggleFollow([FromBody] ToggleFollowRequest request, CancellationToken cancellationToken = default)
        {
            if (User.Identity?.IsAuthenticated != true)
            {
                return Unauthorized();
            }

            if (request.UserId == request.FollowedUserId)
            {
                return BadRequest("You cannot follow yourself.");
            }

            var user = await _db.MyAppUsers.FindAsync(request.UserId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var followedUser = await _db.MyAppUsers.FindAsync(request.FollowedUserId);
            if (followedUser == null)
            {
                return NotFound("User to follow/unfollow not found.");
            }

            var existingFollow = await _db.FollowForUser
                .FirstOrDefaultAsync(f => f.FollowerUserId == request.UserId && f.FollowedUserId == request.FollowedUserId, cancellationToken);

            if (existingFollow != null)
            {
                _db.FollowForUser.Remove(existingFollow);
                await _db.SaveChangesAsync(cancellationToken);

                return Ok(new { Message = "User unfollowed successfully.", IsFollowing = false });
            }
            else
            {
                var follow = new FollowForUser
                {
                    FollowerUserId = request.UserId.Value,
                    FollowedUserId = request.FollowedUserId,
                    StartedFollowing = DateTime.UtcNow,
                };

                _db.FollowForUser.Add(follow);
                await _db.SaveChangesAsync(cancellationToken);

                return Ok(new { Message = "User followed successfully.", IsFollowing = true });
            }
        }
    }

    public class ToggleFollowRequest
    {
        public int FollowedUserId { get; set; }
        public int? UserId { get; set; }
    }
}
