using Microsoft.AspNetCore.Mvc;
using Stripe;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models.Stripe;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.IO;
using System.Threading.Tasks;

namespace RS1_2024_25.API.Endpoints.StripeEndpoint
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly string _stripeWebhookSecretKey = "whsec_c7845fbbefc36be6055cc51d9e6220b2529d13b35b6b623cf77738d988fd758f";  

        public PaymentController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("stripe-webhook")]
        public async Task<IActionResult> HandleStripeWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            Event stripeEvent;

            try
            {
                stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], _stripeWebhookSecretKey);
            }
            catch (StripeException e)
            {
                return BadRequest($"Stripe webhook error: {e.Message}");
            }

            if (stripeEvent.Type == "payment_intent.succeeded")
            {
                var paymentIntent = stripeEvent.Data.Object as PaymentIntent;

                if (paymentIntent != null)
                {
                    var chargeService = new ChargeService();
                    var charges = chargeService.List(new ChargeListOptions { PaymentIntent = paymentIntent.Id });

                    var charge = charges.FirstOrDefault();

                    if (charge != null)
                    {
                        var transaction = new PaymentTransaction
                        {
                            StripePaymentIntentId = paymentIntent.Id,
                            Amount = paymentIntent.AmountReceived / 100m,
                            Currency = paymentIntent.Currency,
                            Status = paymentIntent.Status,
                            CustomerEmail = charge.ReceiptEmail,
                            CreatedAt = DateTime.UtcNow
                        };

                        await _context.PaymentTransactions.AddAsync(transaction);
                        await _context.SaveChangesAsync();
                    }
                }
            }

            return Ok();
        }
    }
}
