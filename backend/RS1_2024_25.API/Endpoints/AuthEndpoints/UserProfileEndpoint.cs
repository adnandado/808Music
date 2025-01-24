using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;

namespace RS1_2024_25.API.Endpoints.AuthEndpoints
{
    [ApiController]
    [Route("api/users")]
    public class UserProfileEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public UserProfileEndpoint(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        [Route("profile-picture/{userId}")]
        public async Task<ActionResult> GetProfilePicture(int userId, CancellationToken cancellationToken = default)
        {
            var user = await _db.MyAppUsers.FindAsync(userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            if (!string.IsNullOrEmpty(user.pfpCoverPath))
            {
                return Ok(new { ProfilePicturePath = user.pfpCoverPath, Username = user.Username });
            }
            else
            {
                user.pfpCoverPath = "/Images/ProfilePictures/placeholder.png";
                await _db.SaveChangesAsync(cancellationToken);
                return Ok(new { ProfilePicturePath = user.pfpCoverPath });
            }
        }
    }
}
