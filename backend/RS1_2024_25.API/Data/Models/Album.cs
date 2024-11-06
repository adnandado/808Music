using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    public class Album
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public string Distributor { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string Type { get; set; }
        public int NumOfTracks { get; set; }
        public string CoverPath { get; set; }

        [ForeignKey(nameof(Artist))]
        public int ArtistId { get; set; }
        public Artist? Artist { get; set; }

    }
}
