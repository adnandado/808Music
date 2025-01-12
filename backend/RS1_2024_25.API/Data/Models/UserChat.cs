using RS1_2024_25.API.Data.Models.Auth;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    public class UserChat
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey(nameof(MyAppUser))]
        public int PrimaryChatterId { get; set; }
        public MyAppUser PrimaryChatter { get; set; }

        [ForeignKey(nameof(MyAppUser))]
        public int SecondaryChatterId { get; set; }
        public MyAppUser SecondaryChatter { get; set; }
        public bool Muted { get; set; }
        public bool Blocked { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastMessageAt { get; set; }
    }
}
