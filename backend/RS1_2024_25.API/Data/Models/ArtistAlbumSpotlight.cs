using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    [PrimaryKey(nameof(ArtistId))]
    public class ArtistAlbumSpotlight
    {
        [ForeignKey(nameof(Artist))]
        public int ArtistId { get; set; }
        public Artist? Artist { get; set; }

        [ForeignKey(nameof(Album))]
        public int AlbumId { get; set; }
        public Album? Album { get; set; }
    }
}
