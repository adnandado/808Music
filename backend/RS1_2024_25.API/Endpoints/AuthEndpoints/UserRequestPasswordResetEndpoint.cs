using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Data.Models.Mail;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using RS1_2024_25.API.Services.Interfaces;
using System.Text;

namespace RS1_2024_25.API.Endpoints.AuthEndpoints
{
    public class UserRequestPasswordResetEndpoint(ApplicationDbContext db, TokenProvider tp, IConfiguration cfg, IMyMailService ms) : MyEndpointBaseAsync.WithRequest<RequestForPasswordReset>.WithActionResult
    {
        [HttpPost]
        public override async Task<ActionResult> HandleAsync([FromBody] RequestForPasswordReset request, CancellationToken cancellationToken = default)
        {
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
            mailBody.Append($"Here's your password recovery token: {resetToken}\n");
            mailBody.Append($"Visit this link to reset your password...(TODO)\n");
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

    public class RequestForPasswordReset
    {
        public string Email { get; set; }
    }
}
