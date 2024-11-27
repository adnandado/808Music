using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Data.Models.Mail;
using RS1_2024_25.API.Helper;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using RS1_2024_25.API.Services.Interfaces;
using System.Text;
using System.Text.RegularExpressions;

namespace RS1_2024_25.API.Endpoints.AuthEndpoints
{
    public class UserRequestPasswordResetEndpoint(ApplicationDbContext db, TokenProvider tp, IConfiguration cfg, IMyMailService ms) : MyEndpointBaseAsync.WithRequest<RequestForPasswordReset>.WithActionResult
    {
        [HttpPost]
        public override async Task<ActionResult> HandleAsync([FromBody] RequestForPasswordReset request, CancellationToken cancellationToken = default)
        {
            if(!request.HandleValidation())
            {
                return BadRequest("Invalid email format");
            }

            MyAppUser myAppUser = await db.MyAppUsers.SingleOrDefaultAsync(u => u.Email == request.Email, cancellationToken);
            if(myAppUser == null)
            {
                return BadRequest("User with this email does not exist");
            }
            string resetToken = tp.CreateResetToken();
            await db.MyResetTokens.AddAsync(new MyResetToken {
                ResetToken = resetToken,
                ExpiryTime = DateTime.UtcNow.AddMinutes(cfg.GetValue<int>("Jwt:ResetExpirationInMinutes")),
                MyAppUserId = myAppUser.ID
            });
            await db.SaveChangesAsync();

            
            var mailBody = new StringBuilder();
            mailBody.Append($"Hi {myAppUser.Username},\n\n");
            mailBody.Append($"Visit this link to reset your password...\n");
            mailBody.Append($"{cfg["FrontendUrl"]}/auth/reset-password?resetToken={resetToken}\n");
            mailBody.Append($"It's valid for the next {cfg["Jwt:ResetExpirationInMinutes"]} minutes.\n\n");
            mailBody.Append($"808 Music");

            await ms.Send(new MailData()
            {
                Subject = "Password Reset - 808 Music",
                IsBodyHtml = false,
                To = myAppUser.Email,
                Body = mailBody
            });

            return Ok("We've sent you an email to reset your password");
        }
    }

    public class RequestForPasswordReset : IValidatable
    {
        public string Email { get; set; }

        public bool HandleValidation()
        {
            if (!Regex.IsMatch(this.Email, "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"))
                return false;
            return true;
        }
    }
}
