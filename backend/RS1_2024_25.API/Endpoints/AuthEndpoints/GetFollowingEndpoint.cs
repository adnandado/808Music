using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace RS1_2024_25.API.Endpoints.FollowEndpoints
{
    [ApiController]
    [Route("api/follow")]
    public class GetFollowingEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public GetFollowingEndpoint(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet("following")]
        public async Task<ActionResult> GetFollowing([FromQuery] int userId, CancellationToken cancellationToken = default)
        {
            var user = await _db.MyAppUsers.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var followingUsers = await _db.FollowForUser
                .Where(f => f.FollowerUserId == userId)
                .Select(f => new FollowingDto
                {
                    UserId = f.FollowedUser.ID,
                    Username = f.FollowedUser.Username,
                    ProfilePicture = f.FollowedUser.pfpCoverPath,
                    ArtistId = null 
                })
                .ToListAsync(cancellationToken);

            var followingArtists = await _db.Follows
                .Where(f => f.MyAppUserId == userId)
                .Select(f => new FollowingDto
                {
                    UserId = f.MyAppUserId, 
                    ArtistId = f.ArtistId,
                    Username = f.Artist.Name,
                    ProfilePicture = f.Artist.ProfilePhotoPath
                })
                .ToListAsync(cancellationToken);

            var combinedFollowing = followingUsers.Concat(followingArtists).ToList();

            return Ok(combinedFollowing);
        }

        [HttpGet("followers")]
        public async Task<ActionResult> GetFollowers([FromQuery] int userId, CancellationToken cancellationToken = default)
        {
            var user = await _db.MyAppUsers.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var followers = await _db.FollowForUser
                .Where(f => f.FollowedUserId == userId)
                .Select(f => f.FollowerUser)
                .ToListAsync(cancellationToken);

            var followerDtos = followers.Select(f => new
            {
                f.ID,
                f.Username,
                ProfilePicture = f.pfpCoverPath
            }).ToList();

            return Ok(followerDtos);
        }

        [HttpGet("following-and-followers")]
        public async Task<ActionResult> GetFollowingAndFollowers([FromQuery] int userId, CancellationToken cancellationToken = default)
        {
            var user = await _db.MyAppUsers.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var followingUsers = await _db.FollowForUser
                .Where(f => f.FollowerUserId == userId)
                .Select(f => new FollowingDto
                {
                    UserId = f.FollowedUser.ID,
                    Username = f.FollowedUser.Username,
                    ProfilePicture = f.FollowedUser.pfpCoverPath,
                    ArtistId = null
                })
                .ToListAsync(cancellationToken);

            var followingArtists = await _db.Follows
                .Where(f => f.MyAppUserId == userId)
                .Select(f => new FollowingDto
                {
                    UserId = f.MyAppUserId, 
                    ArtistId = f.ArtistId,
                    Username = f.Artist.Name,
                    ProfilePicture = f.Artist.ProfilePhotoPath
                })
                .ToListAsync(cancellationToken);

           
            var followers = await _db.FollowForUser
                .Where(f => f.FollowedUserId == userId)
                .Select(f => f.FollowerUser)
                .ToListAsync(cancellationToken);

            var followerDtos = followers.Select(f => new
            {
                f.ID,
                f.Username,
                ProfilePicture = f.pfpCoverPath
            }).ToList();

          
            return Ok(new
            {
                Following = followingUsers.Concat(followingArtists).ToList(),
                Followers = followerDtos
            });
        }

        public class FollowingDto
        {
            public int UserId { get; set; }
            public int? ArtistId { get; set; } 
            public string Username { get; set; }
            public string ProfilePicture { get; set; }
        }
    }
}
