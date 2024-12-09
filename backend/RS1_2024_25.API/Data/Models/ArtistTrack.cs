using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    public class ArtistTrack
    {
        [Key]
        public int Id { get; set; }
        public bool IsLead { get; set; }
        public bool ShowOnProfile { get; set; }

        [ForeignKey(nameof(Artist))]
        public int ArtistId { get; set; }
        public Artist? Artist { get; set; }

        [ForeignKey(nameof(Track))]
        public int TrackId { get; set; }
        public Track? Track { get; set; }
    }
}
