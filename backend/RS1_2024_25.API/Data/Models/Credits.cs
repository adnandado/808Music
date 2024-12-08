using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    public class Credits
    {
        public string Producers { get; set; }
        public string Writers { get; set; }
        public string Performers { get; set; }
        public string CopyrightOwner { get; set; }

        [Key]
        [ForeignKey(nameof(Track))]
        public int TrackId { get; set; }
        public Track Track { get; set; }
    }
}
