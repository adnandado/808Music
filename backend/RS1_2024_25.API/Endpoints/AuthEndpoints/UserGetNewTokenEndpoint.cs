using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using System.IdentityModel.Tokens.Jwt;

namespace RS1_2024_25.API.Endpoints.AuthEndpoints
{
    public class UserGetNewTokenEndpoint(ApplicationDbContext db, TokenProvider tp, IConfiguration cfg) : MyEndpointBaseAsync.WithRequest<TokenRequest>.WithActionResult<TokenResponse>
    {
        [HttpPost]
        public override async Task<ActionResult<TokenResponse>> HandleAsync([FromBody] TokenRequest request, CancellationToken cancellationToken = default)
        {
            MyRefreshToken? myRefToken = await db.MyRefreshTokens.SingleOrDefaultAsync(t => t.Token == request.RefreshToken && t.ExpiryTime > DateTime.UtcNow, cancellationToken);
            if(myRefToken == null)
            {
                return BadRequest("Refresh token not valid (Could be expired).");
            }
            var jwt = new JwtSecurityToken(request.JwtToken);
            if(myRefToken.MyAppUserId.ToString() != jwt.Subject)
            {
                return Forbid();
            }

            myRefToken.Token = tp.CreateRefreshToken();
            myRefToken.ExpiryTime = DateTime.UtcNow.AddHours(cfg.GetValue<int>("Jwt:RefreshExpirationInHours"));
            await db.SaveChangesAsync(cancellationToken);

            var response = new TokenResponse
            {
                Token = tp.Create((await db.MyAppUsers.FindAsync(myRefToken.MyAppUserId, cancellationToken))!),
                RefreshToken = myRefToken.Token
            };
            return Ok(response);
        }
    }

    public class TokenRequest
    {
        public string JwtToken { get; set; }
        public string RefreshToken { get; set; }
    }

    public class TokenResponse
    {
        public string Token { get; set; }
        public string RefreshToken { get; set; }
    }
}
