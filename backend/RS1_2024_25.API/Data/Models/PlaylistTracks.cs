using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    [PrimaryKey(nameof(PlaylistId), nameof(TrackId))]
    public class PlaylistTracks
    {
        [ForeignKey(nameof(Playlist))]
        public int PlaylistId { get; set; }
        public Playlist Playlist { get; set; }

        [ForeignKey(nameof(Track))]
        public int TrackId { get; set; }
        public Track Track { get; set; }

        public int TrackOrder { get; set; }
    }
}
