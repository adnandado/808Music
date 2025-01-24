using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;

namespace RS1_2024_25.API.Endpoints.UserEndpoints
{
    [ApiController]
    [Route("api/users")]
    public class UserHeaderColorEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public UserHeaderColorEndpoint(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        [Route("header-color/{userId}")]
        public async Task<ActionResult> GetHeaderColor(int userId, CancellationToken cancellationToken = default)
        {
            var user = await _db.MyAppUsers.FindAsync(userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            return Ok(new { HeaderColor = user.HeaderColor ?? "#ffffff" }); // Zadana boja ako nije postavljena
        }

        [HttpPut]
        [Route("header-color/{userId}")]
        public async Task<ActionResult> UpdateHeaderColor(int userId, [FromBody] UpdateHeaderColorRequest request, CancellationToken cancellationToken = default)
        {
            var user = await _db.MyAppUsers.FindAsync(userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            user.HeaderColor = request.HeaderColor;
            await _db.SaveChangesAsync(cancellationToken);

            return Ok(new { Message = "Header color updated successfully.", HeaderColor = user.HeaderColor });
        }
    }

    public class UpdateHeaderColorRequest
    {
        public string HeaderColor { get; set; }
    }
}
