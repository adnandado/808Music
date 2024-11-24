using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using RS1_2024_25.API.Data.Models.Auth;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Authentication;
using System.Security.Claims;
using System.Text;

namespace RS1_2024_25.API.Services
{
    public class TokenProvider(IConfiguration cfg)
    {
        private Random rnd = new Random();
        public string Create(MyAppUser user)
        {
            string secretKey = cfg["Jwt:Secret"]!;
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor{
                Subject = new System.Security.Claims.ClaimsIdentity([
                    new Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub, user.ID.ToString()),
                    new Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.IsAdmin ? "Admin": "None")
                ]),
                Audience = cfg["Jwt:Audience"],
                Issuer = cfg["Jwt:Issuer"],
                Expires = DateTime.Now.AddHours(cfg.GetValue<int>("Jwt:ExpirationInHours")),
                SigningCredentials = credentials
            };

            var jwtHandler = new JsonWebTokenHandler();
            return jwtHandler.CreateToken(tokenDescriptor);
        }

        public string CreateRefreshToken()
        {
            byte[] bytes = new byte[64];
            rnd.NextBytes(bytes);
            return Convert.ToBase64String(bytes);
        }

        public string CreateResetToken()
        {
            byte[] bytes = new byte[32];
            rnd.NextBytes(bytes);
            return Convert.ToHexString(bytes);
        }
    }
}
