using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data.Models.Auth;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    [PrimaryKey(nameof(MyAppUserId), nameof(ArtistId))]
    public class UserArtist
    {
        [ForeignKey(nameof(MyAppUser))]
        public int MyAppUserId { get; set; }
        public MyAppUser? User { get; set; }

        [ForeignKey(nameof(Artist))]
        public int ArtistId { get; set; }
        public Artist? Artist { get; set; }

        [ForeignKey(nameof(UserArtistRole))]
        public int RoleId { get; set; }
        public UserArtistRole? Role { get; set; }
        public bool IsUserOwner { get; set; }
    }
}
