using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data;
using System.Threading;
using System.Threading.Tasks;
using RS1_2024_25.API.Helper.Api;
using static SubscriptionAddEndpoint;

public class SubscriptionAddEndpoint : MyEndpointBaseAsync
    .WithRequest<SubscriptionAddRequest>
    .WithResult<SubscriptionAddResponse>
{
    private readonly ApplicationDbContext _db;

    public SubscriptionAddEndpoint(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpPost("add-subscription")]
    public override async Task<SubscriptionAddResponse> HandleAsync([FromBody] SubscriptionAddRequest request, CancellationToken cancellationToken = default)
    {
        var user = await _db.MyAppUsers.FindAsync(request.UserId);
        if (user == null)
        {
            return new SubscriptionAddResponse { Success = false, Message = "User not found." };
        }

        var subscription = new Subscription
        {
            IsActive = true,
            StartedDate = DateTime.Now,
            ReedemsOn = DateTime.Now,
            SubscriptionType = request.SubscriptionType
        };

        switch (request.SubscriptionType)
        {
            case 1: 
                subscription.MonthlyPrice = 9.99f;
                subscription.RenewalOn = request.RenewalOn; 
                subscription.EndDate = DateTime.Now.AddMonths(1);
                break;
            case 2:
                subscription.MonthlyPrice = 8.99f;
                subscription.RenewalOn = true; 
                subscription.EndDate = DateTime.Now.AddMonths(6);
                break;
            case 3:
                subscription.MonthlyPrice = 6.50f;
                subscription.RenewalOn = true; 
                subscription.EndDate = DateTime.Now.AddYears(1);
                break;
            default:
                return new SubscriptionAddResponse { Success = false, Message = "Invalid subscription type." };
        }

        _db.Subscription.Add(subscription);
        await _db.SaveChangesAsync(cancellationToken);

        user.SubscriptionId = subscription.Id;
        _db.MyAppUsers.Update(user);
        await _db.SaveChangesAsync(cancellationToken);

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
