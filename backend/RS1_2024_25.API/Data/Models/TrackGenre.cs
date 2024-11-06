using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    public class TrackGenre
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey(nameof(Track))]
        public int TrackId { get; set; }
        public Track? Track { get; set; }

        [ForeignKey(nameof(Genre))]
        public int GenreId {  get; set; }
        public Genre? Genre { get; set; }
    }
}
