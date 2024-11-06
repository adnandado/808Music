using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    public class OrderDetail
    {
        [Key]
        public int Id { get; set; }
        public double UnitPrice { get; set; }
        public int QtyOrdered { get; set; }
        public double TotalPrice { get; set; }

        [ForeignKey(nameof(Order))]
        public int OrderId { get; set; }
        public Order? Order { get; set; }

        [ForeignKey(nameof(Product))]
        public int ProductId { get; set; }
        public Product? Product { get; set; }
    }
}
