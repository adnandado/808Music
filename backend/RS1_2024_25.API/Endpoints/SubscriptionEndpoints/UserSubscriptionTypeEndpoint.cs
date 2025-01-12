using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;

namespace RS1_2024_25.API.Endpoints.SubscriptionEndpoints
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserSubscriptionTypeEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public UserSubscriptionTypeEndpoint(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserSubscriptionDetails(int userId)
        {
            var user = await _dbContext.MyAppUsers
                .Include(u => u.Subscription)
                .FirstOrDefaultAsync(u => u.ID == userId);

            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            if (user.Subscription == null || !user.Subscription.IsActive || user.Subscription.EndDate < DateTime.UtcNow)
            {
                return Ok(new
                {
                    subscription = (object)null,
                    message = "User does not have an active subscription."
                });
            }

            var subscriptionDetails = await _dbContext.SubscriptionDetails
                .FirstOrDefaultAsync(s => s.SubscriptionType == user.Subscription.SubscriptionType);

            if (subscriptionDetails == null)
            {
                return NotFound(new { message = "Subscription type details not found." });
            }

            var response = new
            {
                subscriptionType = subscriptionDetails.SubscriptionType,
                title = subscriptionDetails.Title,
                description = subscriptionDetails.Description,
                price = subscriptionDetails.Price,
                startDate = user.Subscription.StartedDate,
                endDate = user.Subscription.EndDate,
                renewalOn = user.Subscription.RenewalOn,
                message = "User subscription details retrieved successfully."
            };

            return Ok(new { subscription = response });
        }
    }
}
