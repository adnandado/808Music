using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    public class Notification
    {
        [Key]
        public int Id { get; set; }
        public string Type { get; set; }

        [ForeignKey(nameof(Artist))]
        public int ArtistId { get; set; }
        public Artist? Artist { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool Sent { get; set; }
        public int ContentId { get; set; }
    }
}
