namespace RS1_2024_25.API.Data.Models.Stripe
{
    public class PaymentTransaction
    {
        public int Id { get; set; }
        public string StripePaymentIntentId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; }
        public string Status { get; set; }
        public string? CustomerEmail { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
