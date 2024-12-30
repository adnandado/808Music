using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data.Models.Auth;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    [PrimaryKey(nameof(MyAppUserId), nameof(ArtistId))]
    public class Follow
    {
        [ForeignKey(nameof(MyAppUser))]
        public int MyAppUserId { get; set; }
        public MyAppUser MyAppUser { get; set; }

        [ForeignKey(nameof(Artist))]
        public int ArtistId { get; set; }
        public Artist Artist { get; set; }

        public DateTime StartedFollowing { get; set; }
        public bool WantsNotifications { get; set; }
    }
}
