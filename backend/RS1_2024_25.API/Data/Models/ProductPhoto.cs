using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    public class ProductPhoto
    {
        [Key]
        public int Id { get; set; }
        public string Path { get; set; }
        public string ThumbnailPath { get; set; } 


        [ForeignKey(nameof(Product))]
        public int ProductId { get; set; }
        public Product? Product { get; set; }
    }
}
