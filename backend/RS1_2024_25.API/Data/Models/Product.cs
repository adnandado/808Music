using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public int QtyInStock { get; set; }
        public float Price { get; set; }
        public bool IsDigital { get; set; }

        [ForeignKey(nameof(Artist))]
        public int ArtistId { get; set; }
        public Artist? Artist { get; set; }
    }
}
