using Microsoft.Extensions.Options;
using RS1_2024_25.API.Data.Models.Stripe;
using Stripe; 

namespace RS1_2024_25.API.Services.Interfaces
{
    public class StripeService
    {
        private readonly string _secretKey;

        public StripeService(IOptions<StripeSettings> stripeSettings)
        {
            _secretKey = stripeSettings.Value.SecretKey;
            StripeConfiguration.ApiKey = _secretKey;
        }

        public async Task<string> CreatePaymentIntent(int amount, string email)
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = amount,
                Currency = "eur",
                PaymentMethodTypes = new List<string> { "card" },
                ReceiptEmail = email
            };
            var service = new PaymentIntentService();
            PaymentIntent paymentIntent = await service.CreateAsync(options);
            return paymentIntent.ClientSecret;
        }
    }
}
