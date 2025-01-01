using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data.Models.Auth;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    [PrimaryKey(nameof(MyAppUserId), nameof(NotificationId))]
    public class ReadNotification
    {
        [ForeignKey(nameof(MyAppUser))]
        public int MyAppUserId { get; set; }
        public MyAppUser? MyAppUser { get; set; }

        [ForeignKey(nameof(Notification))]
        public int NotificationId { get; set; }
        public Notification? Notification { get; set; }
        public DateTime ReadAt { get; set; }
    }
}
