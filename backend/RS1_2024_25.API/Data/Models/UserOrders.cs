using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Endpoints.ProductEndpoints;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    [PrimaryKey(nameof(MyAppUserId), nameof(OrderId))]
    public class UserOrders
    {
        [ForeignKey(nameof(MyAppUser))]
        public int MyAppUserId { get; set; }
        public MyAppUser MyAppUser { get; set; }

        [ForeignKey(nameof(Order))]
        public int OrderId { get; set; }
        public Order Order { get; set; }

        public DateTime DateAdded { get; set; } = DateTime.UtcNow;
    }
}
