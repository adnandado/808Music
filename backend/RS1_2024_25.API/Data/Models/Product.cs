using Stripe;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public int QtyInStock { get; set; } = 1;
        public float Price { get; set; } 
        public bool IsDigital { get; set; } = false;
        public ICollection<ProductPhoto> Photos { get; set; } = new List<ProductPhoto>();
        public string Slug { get; set; }
        public decimal SaleAmount { get; set; } = 0;
        [ForeignKey(nameof(Artist))]
        public int ArtistId { get; set; }
        public Artist? Artist { get; set; }
    }
}
