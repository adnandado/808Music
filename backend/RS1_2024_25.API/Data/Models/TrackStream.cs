using RS1_2024_25.API.Data.Models.Auth;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    public class TrackStream
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey(nameof(Track))]
        public int TrackId { get; set; }
        public Track? Track { get; set; }

        public DateTime StreamedAt { get; set; } 

        public int? UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public MyAppUser? User { get; set; }

    }
}
