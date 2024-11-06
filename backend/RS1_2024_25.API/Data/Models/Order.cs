using RS1_2024_25.API.Data.Models.Auth;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }
        public string Status { get; set; }
        public int TotalPrice { get; set; }

        [ForeignKey(nameof(MyAppUser))]
        public int MyAppUserId { get; set; }
        public MyAppUser? MyAppUser { get; set; }
    }
}
