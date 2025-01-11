using RS1_2024_25.API.Data.Models.Auth;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    public class ChatMessage
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey(nameof(UserChat))]
        public int UserChatId { get; set; }
        public UserChat UserChat { get; set; }
        public string Message { get; set; } = string.Empty;
        public int ContentId { get; set; }
        public string ContentType { get; set; } = "Track";

        [ForeignKey(nameof(MyAppUser))]
        public int SenderId { get; set; }
        public MyAppUser Sender { get; set; }
        public DateTime SentAt { get; set; }
        public bool Seen { get; set; }
        public DateTime SeetAt { get; set; }
    }
}
