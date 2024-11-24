using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace RS1_2024_25.API.Data.Models.Auth
{
    public class MyResetToken
    {
        [Key]
        public int Id { get; set; }
        public string ResetToken { get; set; }
        public DateTime ExpiryTime { get; set; }

        [ForeignKey(nameof(MyAppUser))]
        public int MyAppUserId { get; set; }
        public MyAppUser? MyAppUser { get; set; }
    }
}
