using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    public class Track
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public int Length { get; set; }
        public int Streams { get; set; }
        public bool isExplicit { get; set; }
        public string TrackPath { get; set; } = string.Empty;

        [ForeignKey(nameof(Album))]
        public int AlbumId { get; set; }
        public Album? Album { get; set; }
    }
}
