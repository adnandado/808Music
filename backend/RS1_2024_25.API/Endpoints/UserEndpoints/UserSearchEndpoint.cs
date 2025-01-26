using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services.Interfaces;

namespace RS1_2024_25.API.Endpoints.UserEndpoints
{
    public class UserSearchEndpoint(ApplicationDbContext db, IMyCacheService cs) : MyEndpointBaseAsync.WithRequest<UserSearchRequest>.WithActionResult<List<UserSearchResponse>>
    {
        [Authorize]
        [HttpGet]
        public override async Task<ActionResult<List<UserSearchResponse>>> HandleAsync([FromQuery] UserSearchRequest request, CancellationToken cancellationToken = default)
        {
            var users = await cs.GetAsync<List<MyAppUser>>("users", async () =>
            {
                List<MyAppUser> users = await db.MyAppUsers.ToListAsync();
                return users;
            }, cancellationToken);

            var queryable = users.AsQueryable();

            if(request.SearchString != string.Empty)
            {
                return Ok(queryable.Where(u => u.Username.ToLower().Contains(request.SearchString.ToLower())).Take(request.ReturnAmount).Select(a => new UserSearchResponse
                {
                    Id = a.ID,
                    Username = a.Username,
                    ProfilePicture = a.pfpCoverPath != "" ? a.pfpCoverPath : "/Images/ProfilePictures/placeholder.png"
                }).ToList());
            }
            else
            {
                return Ok(queryable.Take(request.ReturnAmount).Select(a => new UserSearchResponse
                {
                    Id = a.ID,
                    Username = a.Username,
                    ProfilePicture = a.pfpCoverPath != "" ? a.pfpCoverPath : "/Images/ProfilePictures/placeholder.png"
                }).ToList());
            }
        }
    }

    public class UserSearchRequest
    {
        public string SearchString { get; set; } = string.Empty;
        public int ReturnAmount { get; set; } = 5;
    }

    public class UserSearchResponse
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string ProfilePicture { get; set; } = string.Empty;
    }
}
