using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using System.Threading;
using System.Threading.Tasks;

namespace RS1_2024_25.API.Endpoints.FollowEndpoints
{
    [ApiController]
    [Route("api/follow")]
    public class IsFollowingUserEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public IsFollowingUserEndpoint(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet("is-following")]
        public async Task<ActionResult> IsFollowing([FromQuery] IsFollowingRequest request, CancellationToken cancellationToken = default)
        {
          
            var user = await _db.MyAppUsers.FindAsync(request.FollowerUserId);
            if (user == null)
            {
                return NotFound("Follower user not found.");
            }

            var followedUser = await _db.MyAppUsers.FindAsync(request.FollowedUserId);
            if (followedUser == null)
            {
                return NotFound("Followed user not found.");
            }

            var isFollowing = await _db.FollowForUser
                .AnyAsync(f => f.FollowerUserId == request.FollowerUserId && f.FollowedUserId == request.FollowedUserId, cancellationToken);

            return Ok(new
            {
                IsFollowing = isFollowing,
                Message = isFollowing ? "User is already following." : "User is not following."
            });
        }
    }

    public class IsFollowingRequest
    {
        public int FollowerUserId { get; set; }
        public int FollowedUserId { get; set; }
    }
}
