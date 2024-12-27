using System.ComponentModel.DataAnnotations;

namespace RS1_2024_25.API.Data.Models
{
    public class SubscriptionDetails
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public float Price { get; set; }

        [Required]
        public int SubscriptionType { get; set; } // 1 = 1 month, 2 = 2 months, 3 = 3 months
    }
}
