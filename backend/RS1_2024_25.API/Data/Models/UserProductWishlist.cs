using RS1_2024_25.API.Data.Models.Auth;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    public class UserProductWishlist
    {
        public int Id { get; set; }
        [ForeignKey(nameof(Product))]
        public int ProductId { get; set; }
        public Product Product { get; set; }

        [ForeignKey(nameof(MyAppUser))]
        public int UserId { get; set; }
        public MyAppUser MyAppUser { get; set; }
        public DateTime DateAdded { get; set; } = DateTime.UtcNow;

    }
}
