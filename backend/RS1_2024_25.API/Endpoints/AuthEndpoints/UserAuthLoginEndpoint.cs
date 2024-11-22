using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.AuthEndpoints
{
    public class UserAuthLoginEndpoint(ApplicationDbContext db, TokenProvider tp) : MyEndpointBaseAsync.WithRequest<LoginRequest2>.WithActionResult<LoginResponse2>
    {
        [HttpPost]
        public override async Task<ActionResult<LoginResponse2>> HandleAsync([FromBody] LoginRequest2 request, CancellationToken cancellationToken = default)
        {
            MyAppUser user = await db.MyAppUsers.FirstOrDefaultAsync(u => u.Username == request.Username, cancellationToken);
            if (user == null)
                return BadRequest("Username or password incorrect");
            if (!BCrypt.Net.BCrypt.EnhancedVerify(request.Password, user.Password))
                return BadRequest("Username or password incorrect");
            var response = new LoginResponse2()
            {
                Token = tp.Create(user)
            };
            return Ok(response);
        }
    }

    public class LoginRequest2
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class LoginResponse2
    {
        public string Token { get; set; }
    }
}
