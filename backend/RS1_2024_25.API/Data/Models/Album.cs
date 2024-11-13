using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    public class Album
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public string Distributor { get; set; } = string.Empty;
        public DateTime ReleaseDate { get; set; }

        //TODO: add to domain model

        [ForeignKey(nameof(AlbumType))]
        public int AlbumTypeId { get; set; } = 4;
        public AlbumType AlbumType { get; set; }

        public bool IsActive { get; set; }
        public int NumOfTracks { get; set; }
        public string CoverPath { get; set; } = string.Empty;

        [ForeignKey(nameof(Artist))]
        public int ArtistId { get; set; }
        public Artist? Artist { get; set; }

    }
}
