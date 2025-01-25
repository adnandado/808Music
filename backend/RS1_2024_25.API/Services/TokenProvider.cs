using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data.Models.Auth;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Authentication;
using System.Security.Claims;
using System.Text;

namespace RS1_2024_25.API.Services
{
    public class TokenProvider(IConfiguration cfg, ApplicationDbContext db)
    {
        private Random rnd = new Random();
        public string Create(MyAppUser user)
        {
            string secretKey = cfg["Jwt:Secret"]!;
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new System.Security.Claims.ClaimsIdentity([
                    new Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub, user.ID.ToString()),
                    new Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.IsAdmin ? "Admin": "None"),
                    new Claim("Username", user.Username)
                ]);

            List<UserArtistRole> roles = db.UserArtistRoles.ToList();
            IQueryable<UserArtist> uas = db.UserArtists.Where(a => a.MyAppUserId == user.ID);

            foreach (UserArtistRole role in roles)
            {
                string artistIds = string.Join(",",uas.Where(ua => ua.RoleId == role.Id).Select(ua => ua.ArtistId).ToList());
                claims.AddClaim(new Claim(role.RoleName, artistIds));
            }

            var tokenDescriptor = new SecurityTokenDescriptor{
                Subject = claims,
                Audience = cfg["Jwt:Audience"],
                Issuer = cfg["Jwt:Issuer"],
                Expires = DateTime.Now.AddHours(cfg.GetValue<int>("Jwt:ExpirationInHours")),
                SigningCredentials = credentials
            };

            var jwtHandler = new JsonWebTokenHandler();
            return jwtHandler.CreateToken(tokenDescriptor);
        }

        public JwtSecurityToken GetDecodedJwt(HttpRequest request)
        {
            string token = request.Headers.Authorization.ToString().Replace("Bearer ", "");
            if (token == string.Empty)
            {
                throw new Exception("JSON Web Token not found");
            }
            var handler = new JwtSecurityTokenHandler();
            return handler.ReadJwtToken(token);
        }

        public JwtSecurityToken GetDecodedJwt(string token)
        {
            if (token == string.Empty)
            {
                throw new Exception("JSON Web Token not found");
            }
            var handler = new JwtSecurityTokenHandler();
            return handler.ReadJwtToken(token);
        }

        public string GetJwtSub(HttpRequest request)
        {
            var decodedToken = GetDecodedJwt(request);
            return decodedToken.Claims.FirstOrDefault(x => x.Type == Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames.Sub)?.Value!;
        }

        public string GetJwtSub(string request)
        {
            var decodedToken = GetDecodedJwt(request);
            return decodedToken.Claims.FirstOrDefault(x => x.Type == Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames.Sub)?.Value!;
        }

        public string GetJwtRoleClaimValue(HttpRequest request)
        {
            var decodedToken = GetDecodedJwt(request);
            return decodedToken.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Role)?.Value!;
        }
        public string GetJwtRoleClaimValue(string token)
        {
            var decodedToken = GetDecodedJwt(token);
            return decodedToken.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Role)?.Value!;
        }

        public string GetJwtClaimValue(HttpRequest request, string claimName)
        {
            var decodedToken = GetDecodedJwt(request);
            return decodedToken.Claims.FirstOrDefault(x => x.Type == claimName)?.Value ?? string.Empty;
        }

        public string GetJwtClaimValue(string token, string claimName)
        {
            var decodedToken = GetDecodedJwt(token);
            return decodedToken.Claims.FirstOrDefault(x => x.Type == claimName)?.Value ?? string.Empty;
        }

        public bool AuthorizeUserArtist(HttpRequest request, int artistToCheck, string[] roleNames)
        {
            var jwt = GetDecodedJwt(request);
            for (int i = 0; i < roleNames.Length; i++) {
                string artistIds = jwt.Claims.FirstOrDefault(c => c.Type == roleNames[i])?.Value ?? string.Empty;
                if(artistIds == string.Empty)
                {
                    continue;
                }
                string[] aIdsArray = artistIds.Split(",");
                for (int j = 0; j < aIdsArray.Length; j++)
                {
                    if (int.Parse(aIdsArray[j]) == artistToCheck)
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        public string CreateRefreshToken()
        {
            byte[] bytes = new byte[64];
            rnd.NextBytes(bytes);
            return Convert.ToBase64String(bytes);
        }


        public string CreateResetToken(int size = 32)
        {
            byte[] bytes = new byte[size];
            rnd.NextBytes(bytes);
            return Convert.ToHexString(bytes);
        }
        public string GenerateReferralCode()
        {
            const string uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const string digits = "0123456789";
            const string lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
            StringBuilder referralCode = new StringBuilder();

            for (int block = 0; block < 3; block++)
            {
                referralCode.Append(uppercaseLetters[rnd.Next(uppercaseLetters.Length)]);
                referralCode.Append(digits[rnd.Next(digits.Length)]);
                referralCode.Append(lowercaseLetters[rnd.Next(lowercaseLetters.Length)]);

                if (block < 2) // Add a dash between blocks
                {
                    referralCode.Append('-');
                }
            }

            return referralCode.ToString();
        }
    }
}
