using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.UserEndpoints
{
    public class UserGetByIdEndpoint(ApplicationDbContext db, TokenProvider tp) : MyEndpointBaseAsync.WithRequest<int>.WithActionResult<UserGetResponse>
    {
        [Authorize]
        [HttpGet("{id}")]
        public override async Task<ActionResult<UserGetResponse>> HandleAsync(int id, CancellationToken cancellationToken = default)
        {
            int userId = int.Parse(tp.GetJwtSub(Request));
            bool isAdmin = tp.GetJwtRoleClaimValue(Request) == "Admin";

            var user = await db.MyAppUsers.FindAsync(id, cancellationToken);

            if(!isAdmin && id != userId)
            {
                return Unauthorized();
            }

            if(user == null)
            {
                return NotFound();
            }

            return Ok(new UserGetResponse
            {
                CountryId = user.CountryId,
                DateOfBirth = DateOnly.FromDateTime(user.DateOfBirth),
                Email = user.Email,
                FirstName = user.FirstName,
                Id = user.ID,
                LastName = user.LastName,
                Username = user.Username,
                PathToPfp = user.pfpCoverPath != "" ? $"/media{user.pfpCoverPath}" : "/media/Images/ProfilePictures/placeholder.png"
            });
        }
    }

    public class UserGetResponse
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateOnly DateOfBirth { get; set; }
        public int CountryId { get; set; }
        public string PathToPfp { get; set; }
    }
}
