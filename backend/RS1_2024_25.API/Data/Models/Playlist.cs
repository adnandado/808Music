using System.ComponentModel.DataAnnotations;

namespace RS1_2024_25.API.Data.Models
{
    public class Playlist
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public int NumOfTracks { get; set; }
        public bool IsPublic { get; set; }
        public string CoverPath { get; set; }
        public bool isLikePlaylist { get; set; } = false;
        public bool IsCollaborative { get; set; } = false;

        public ICollection<UserPlaylist> UserPlaylists { get; set; }
        public ICollection<PlaylistTracks> PlaylistTracks { get; set; }

    }
}
