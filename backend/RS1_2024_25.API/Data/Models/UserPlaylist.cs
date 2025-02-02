using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data.Models.Auth;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    [PrimaryKey(nameof(MyAppUserId), nameof(PlaylistId))]
    public class UserPlaylist
    {
        [ForeignKey(nameof(MyAppUser))]
        public int MyAppUserId { get; set; }
        public MyAppUser User { get; set; }

        [ForeignKey(nameof(Playlist))]
        public int PlaylistId { get; set; }
        public Playlist Playlist { get; set; }
        public bool IsOwner { get; set; } = false;
    }
}
