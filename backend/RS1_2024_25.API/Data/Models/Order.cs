using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data.Models.Auth;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Endpoints.ProductEndpoints
{
    public class Order
    {
        public int Id { get; set; }
        public string Status { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime DateAdded { get; set; } = DateTime.UtcNow;
        public string OrderCode { get; set; } = GenerateOrderCode();

        public ICollection<UserOrders> UserOrders { get; set; }  // Veza prema korisnicima
        public ICollection<OrderDetails> OrderDetails { get; set; }

        private static string GenerateOrderCode()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            return "#" + new string(Enumerable.Repeat(chars, 10)
                                              .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}
