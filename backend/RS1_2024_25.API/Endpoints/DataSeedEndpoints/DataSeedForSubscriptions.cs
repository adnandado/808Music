namespace RS1_2024_25.API.Endpoints.DataSeed;

using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public class SubscriptionDetailsSeedEndpoint(ApplicationDbContext db)
    : MyEndpointBaseAsync
    .WithoutRequest
    .WithResult<string>
{
    [HttpPost]
    public override async Task<string> HandleAsync(CancellationToken cancellationToken = default)
    {
        var subscriptionDetails = new List<SubscriptionDetails>
        {
            new SubscriptionDetails
            {
                Title = "Basic Plan",
                Description = "1-month subscription with renewal option.",
                Price = 9.99f,
                SubscriptionType = 1 // Basic
            },
            new SubscriptionDetails
            {
                Title = "Standard Plan",
                Description = "6-month subscription with automatic renewal.",
                Price = 8.99f,
                SubscriptionType = 2 // Standard
            },
            new SubscriptionDetails
            {
                Title = "Premium Plan",
                Description = "12-month subscription with automatic renewal.",
                Price = 6.50f,
                SubscriptionType = 3 // Premium
            }
        };

        await db.SubscriptionDetails.AddRangeAsync(subscriptionDetails, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);

        return "Subscription details seed data generated successfully.";
    }
}
