using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data.Models.Auth;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    [PrimaryKey(nameof(MyAppUserId))]
    public class MyAppUserPreference
    {
        [ForeignKey(nameof(MyAppUser))]
        public int MyAppUserId { get; set; }
        public MyAppUser? MyAppUser { get; set; }
        public bool AllowPushNotifications { get; set; }
        public bool AllowEmailNotifications { get; set; }
        public string NotificationTypePriority { get; set; } = "None";
    }
}
