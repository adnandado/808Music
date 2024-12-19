using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using RS1_2024_25.API.Data.Models.Stripe;
using Stripe;

namespace RS1_2024_25.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StripeController : ControllerBase
    {
        private readonly string _secretKey;

        public StripeController(IOptions<StripeSettings> stripeSettings)
        {
            _secretKey = stripeSettings.Value.SecretKey;
            StripeConfiguration.ApiKey = _secretKey;
        }

        [HttpPost("create-payment-intent")]
        public async Task<IActionResult> CreatePaymentIntent([FromBody] PaymentRequest request)
        {
            try
            {
                var options = new PaymentIntentCreateOptions
                {
                    Amount = request.Amount,  // Amount u centima
                    Currency = "eur",         // Valuta
                    PaymentMethodTypes = new List<string> { "card" },
                    ReceiptEmail = request.Email 

                };

                var service = new PaymentIntentService();
                PaymentIntent paymentIntent = await service.CreateAsync(options);

                return Ok(new { clientSecret = paymentIntent.ClientSecret });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }

    public class PaymentRequest
    {
        public int Amount { get; set; }  // Amount u centima (npr. 1000 = 10.00 EUR)
        public string Email { get; set; }   
    }
}
