using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace RS1_2024_25.API.Endpoints.PlaylistEndpoints
{
    public class GetUserInfoEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public GetUserInfoEndpoint(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        [Route("api/users/{userId}")]
        public async Task<ActionResult<UserResponse>> GetUserInfoAsync(int userId, CancellationToken cancellationToken = default)
        {
            var user = await _db.MyAppUsers
                                .Where(u => u.ID == userId)
                                .FirstOrDefaultAsync(cancellationToken);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            var userResponse = new UserResponse
            {
                Username = user.Username,
                Email = user.Email
            };

            return Ok(userResponse);
        }

        public class UserResponse
        {
            public required string Username { get; set; }
            public required string Email { get; set; }
        }
    }
}
