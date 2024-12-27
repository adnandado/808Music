using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data;
using System.Threading;
using System.Threading.Tasks;
using RS1_2024_25.API.Helper.Api;
using static SubscriptionUpdateEndpoint;

public class SubscriptionUpdateEndpoint : MyEndpointBaseAsync
    .WithRequest<SubscriptionUpdateRequest>
    .WithResult<SubscriptionUpdateResponse>
{
    private readonly ApplicationDbContext _db;

    public SubscriptionUpdateEndpoint(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpPut("update-subscription")]
    public override async Task<SubscriptionUpdateResponse> HandleAsync([FromBody] SubscriptionUpdateRequest request, CancellationToken cancellationToken = default)
    {
        var user = await _db.MyAppUsers.FindAsync(request.UserId);
        if (user == null || !user.SubscriptionId.HasValue)
        {
            return new SubscriptionUpdateResponse { Success = false, Message = "User or subscription not found." };
        }

        var subscription = await _db.Subscription.FindAsync(user.SubscriptionId.Value);
        if (subscription == null)
        {
            return new SubscriptionUpdateResponse { Success = false, Message = "Subscription not found." };
        }

        subscription.SubscriptionType = request.SubscriptionType;

        switch (request.SubscriptionType)
        {
            case 1: // 1 mjesec
                subscription.MonthlyPrice = 9.99f;
                subscription.RenewalOn = request.RenewalOn;
                subscription.EndDate = DateTime.Now.AddMonths(1);
                break;
            case 2: // 6 mjeseci
                subscription.MonthlyPrice = 8.99f;
                subscription.RenewalOn = true;
                subscription.EndDate = DateTime.Now.AddMonths(6);
                break;
            case 3: // 12 mjeseci
                subscription.MonthlyPrice = 6.50f;
                subscription.RenewalOn = true;
                subscription.EndDate = DateTime.Now.AddYears(1);
                break;
            default:
                return new SubscriptionUpdateResponse { Success = false, Message = "Invalid subscription type." };
        }

        _db.Subscription.Update(subscription);
        await _db.SaveChangesAsync(cancellationToken);

        return new SubscriptionUpdateResponse
        {
            Success = true,
            Message = "Subscription updated successfully",
            SubscriptionId = subscription.Id,
            MonthlyPrice = subscription.MonthlyPrice,
            EndDate = subscription.EndDate
        };
    }

    public class SubscriptionUpdateRequest
    {
        public int UserId { get; set; }
        public int SubscriptionType { get; set; } 
        public bool RenewalOn { get; set; } 
    }

    public class SubscriptionUpdateResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public int SubscriptionId { get; set; }
        public float MonthlyPrice { get; set; }
        public DateTime EndDate { get; set; }
    }
}
