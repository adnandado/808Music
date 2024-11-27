using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Helper.Api;
using System.IdentityModel.Tokens.Jwt;

namespace RS1_2024_25.API.Endpoints.AuthEndpoints
{
    public class UserLogoutEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync.WithRequest<LogoutRequest2>.WithActionResult
    {
        [HttpPost]
        [Authorize]
        public override async Task<ActionResult> HandleAsync(LogoutRequest2 request, CancellationToken cancellationToken = default)
        {
            var decoded = new JwtSecurityToken(request.JwtToken);
            MyRefreshToken? myRefToken = await db.MyRefreshTokens.SingleOrDefaultAsync(r => r.Token == request.RefreshToken && r.MyAppUserId == int.Parse(decoded.Subject), cancellationToken);

            if(myRefToken == null)
            {
                return BadRequest("Something went wrong.");
            }

            db.MyRefreshTokens.Remove(myRefToken);
            await db.SaveChangesAsync(cancellationToken);

            return Ok("You have successfully logged out.");
        }
    }

    public class LogoutRequest2
    {
        public string JwtToken { get; set; }
        public string RefreshToken { get; set; }
    }
}
