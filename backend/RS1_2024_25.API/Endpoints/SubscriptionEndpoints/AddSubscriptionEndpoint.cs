using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data;
using System.Threading;
using System.Threading.Tasks;
using RS1_2024_25.API.Helper.Api;
using static SubscriptionAddEndpoint;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data.Models.Mail;
using System.Text;
using RS1_2024_25.API.Services.Interfaces;

public class SubscriptionAddEndpoint : MyEndpointBaseAsync
    .WithRequest<SubscriptionAddRequest>
    .WithResult<SubscriptionAddResponse>
{
    private readonly ApplicationDbContext _db;
    private readonly IMyMailService _mailService;
    public SubscriptionAddEndpoint(ApplicationDbContext db, IMyMailService mailService)
    {
        _db = db;
        _mailService = mailService;
    }

    [HttpPost("add-subscription")]
    public override async Task<SubscriptionAddResponse> HandleAsync([FromBody] SubscriptionAddRequest request, CancellationToken cancellationToken = default)
    {
        var user = await _db.MyAppUsers.FindAsync(request.UserId);
        if (user == null)
        {
            return new SubscriptionAddResponse { Success = false, Message = "User not found." };
        }

        var subscriptionDetails = await _db.SubscriptionDetails.FirstOrDefaultAsync(sd => sd.SubscriptionType == request.SubscriptionType, cancellationToken);
        if (subscriptionDetails == null)
        {
            return new SubscriptionAddResponse { Success = false, Message = "Invalid subscription type." };
        }

        var subscription = new Subscription
        {
            IsActive = true,
            StartedDate = DateTime.Now,
            ReedemsOn = DateTime.Now,
            SubscriptionType = request.SubscriptionType,
            MonthlyPrice = subscriptionDetails.Price,
            EndDate = DateTime.Now.AddMonths(request.SubscriptionType == 1 ? 1 : request.SubscriptionType == 2 ? 6 : 12)
        };

        _db.Subscription.Add(subscription);
        await _db.SaveChangesAsync(cancellationToken);

        user.SubscriptionId = subscription.Id;
        _db.MyAppUsers.Update(user);
        await _db.SaveChangesAsync(cancellationToken);

        var myAppUser = await _db.MyAppUsers.SingleOrDefaultAsync(u => u.ID == request.UserId, cancellationToken);
        if (myAppUser != null)
        {
            var mailBody = new StringBuilder();
            mailBody.Append("<html><body style='background-color: #f0f0f0; margin: 0; padding: 0;'>");
            mailBody.Append("<div style='width: 100%; background-color: #f0f0f0; padding: 20px; box-sizing: border-box;'>");
            mailBody.Append("<img src='https://i.imgur.com/gZqaDjj.png' alt='Order Confirmation' style='width: 100px; height: auto; display: block; margin: 20px auto;' />");
            mailBody.Append("<div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;'>");
            mailBody.Append("<h2 style='color: #2c3e50; text-align: left;'>Hi " + myAppUser.Username + ",</h2>");
            mailBody.Append("<p style='font-size: 16px; color: #34495e; text-align: left;'>Thank you for subscribing to 808 Music streaming services. ");
            mailBody.Append("<br/>");

            mailBody.Append("<table style='width: 100%; border-collapse: collapse; margin-top: 5px;'>");
            mailBody.Append("<thead>");
            mailBody.Append("<tr style='border-bottom: 1px solid #ddd;'>");
            mailBody.Append("<th style='text-align: left; padding: 8px;'>Title</th>");
            mailBody.Append("<th style='text-align: left; padding: 8px;'>Description</th>");
            mailBody.Append("<th style='text-align: left; padding: 8px;'>Price</th>");
            mailBody.Append("</tr>");
            mailBody.Append("</thead>");
            mailBody.Append("<tbody>");

            mailBody.Append("<tr>");
            mailBody.Append("<td style='padding: 8px;'>" + subscriptionDetails.Title + "</td>");
            mailBody.Append("<td style='padding: 8px;'>" + subscriptionDetails.Description + "</td>");
            mailBody.Append("<td style='padding: 8px;'>$" + subscriptionDetails.Price + "</td>");
            mailBody.Append("</tr>");

            mailBody.Append("</tbody>");
            mailBody.Append("</table>");

            mailBody.Append("<p style='font-size: 16px; color: #34495e; text-align: left; margin-top: 20px;'>");
            mailBody.Append("<strong>Total Price: </strong>$" + subscriptionDetails.Price);
            mailBody.Append("</p>");

            mailBody.Append("<br><p style='font-size: 12px; color: #34495e; text-align: left;'>Thank you, <br/>808 Music</p>");
            mailBody.Append("</div>");
            mailBody.Append("</div>");
            mailBody.Append("</body></html>");

            await _mailService.Send(new MailData()
            {
                Subject = $"Thank you for subscribing to 808 Music!",
                IsBodyHtml = true,
                To = myAppUser.Email,
                Body = mailBody
            });
        }

        return new SubscriptionAddResponse
        {
            Success = true,
            Message = "Subscription added successfully",
            SubscriptionId = subscription.Id,
            MonthlyPrice = subscription.MonthlyPrice,
            EndDate = subscription.EndDate
        };
    }


    public class SubscriptionAddRequest
    {
        public int UserId { get; set; }
        public int SubscriptionType { get; set; } 
        public bool RenewalOn { get; set; } 
    }

    public class SubscriptionAddResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public int SubscriptionId { get; set; }
        public float MonthlyPrice { get; set; }
        public DateTime EndDate { get; set; }
    }
}
