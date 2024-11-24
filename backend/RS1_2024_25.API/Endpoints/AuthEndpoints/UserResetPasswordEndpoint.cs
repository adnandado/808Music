using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Helper;
using RS1_2024_25.API.Helper.Api;
using System.Text.RegularExpressions;

namespace RS1_2024_25.API.Endpoints.AuthEndpoints
{
    public class UserResetPasswordEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync.WithRequest<PasswordResetRequest>.WithActionResult
    {
        [HttpPost]
        public override async Task<ActionResult> HandleAsync([FromBody] PasswordResetRequest request, CancellationToken cancellationToken = default)
        {
            if(!request.HandleValidation())
            {
                return BadRequest("Password must be at least 8 chars long and contain at least 1 number, letter, capital letter and special sign");
            }
            MyResetToken token = await db.MyResetTokens.SingleOrDefaultAsync(t => t.ResetToken == request.ResetToken && DateTime.UtcNow < t.ExpiryTime, cancellationToken);
            if(token == null)
            {
                return BadRequest("Password recovery token invalid or expired");
            }
            MyAppUser user = await db.MyAppUsers.FindAsync(token.MyAppUserId, cancellationToken);
            if(user == null)
            {
                return BadRequest("User does not exist");
            }

            if(BCrypt.Net.BCrypt.EnhancedVerify(request.Password, user.Password))
            {
                return BadRequest("Password can't be the same as before!");
            }

            user.Password = BCrypt.Net.BCrypt.EnhancedHashPassword(request.Password);

            db.MyResetTokens.Remove(token);

            await db.SaveChangesAsync(cancellationToken);

            return Ok("Password changed successfully!");
        }
    }

    public class PasswordResetRequest : IValidatable
    {
        public string Password { get; set; }
        public string ResetToken {  get; set; }

        public bool HandleValidation()
        {
            if (!Regex.IsMatch(this.Password, "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
                return false;
            return true;
        }
    }
}
