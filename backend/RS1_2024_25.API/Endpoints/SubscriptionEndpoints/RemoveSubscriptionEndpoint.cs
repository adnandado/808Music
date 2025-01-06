using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Helper.Api;
using System;
using System.Threading;
using System.Threading.Tasks;

public class SubscriptionCancelEndpoint : MyEndpointBaseAsync
    .WithRequest<SubscriptionCancelRequest>
    .WithResult<SubscriptionCancelResponse>
{
    private readonly ApplicationDbContext _db;

    public SubscriptionCancelEndpoint(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpDelete]
    public override async Task<SubscriptionCancelResponse> HandleAsync(SubscriptionCancelRequest request, CancellationToken cancellationToken = default)
    {
        var user = await _db.MyAppUsers.FindAsync(new object[] { request.UserId }, cancellationToken);

        if (user == null)
        {
            return new SubscriptionCancelResponse
            {
                Success = false,
                Message = "User not found."
            };
        }

        if (user.SubscriptionId == null)
        {
            return new SubscriptionCancelResponse
            {
                Success = false,
                Message = "User does not have an active subscription."
            };
        }

        var subscription = await _db.Subscription.FindAsync(new object[] { user.SubscriptionId }, cancellationToken);

        if (subscription == null)
        {
            return new SubscriptionCancelResponse
            {
                Success = false,
                Message = "Subscription not found."
            };
        }

        if (subscription.EndDate > DateTime.UtcNow)
        {
            subscription.RenewalOn = false;
            await _db.SaveChangesAsync(cancellationToken);

            return new SubscriptionCancelResponse
            {
                Success = true,
                Message = "Subscription cancellation initiated. It will expire at the end of the current period."
            };
        }

        _db.Subscription.Remove(subscription);
        user.SubscriptionId = null;
        await _db.SaveChangesAsync(cancellationToken);

        return new SubscriptionCancelResponse
        {
            Success = true,
            Message = "Subscription successfully removed."
        };
    }
}

public class SubscriptionCancelRequest
{
    public required int UserId { get; set; }
}

public class SubscriptionCancelResponse
{
    public required bool Success { get; set; }
    public required string Message { get; set; }
}
