using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    public class Events
    {
        [Key]
        public int Id { get; set; }
        public string EventTitle { get; set; }

        public string City { get; set; }
        public DateTime EventDate { get; set; }
        public string Country { get; set; }
        public string Venue { get; set; }
        public string EventCover { get; set; }
        public decimal Longitude { get; set; }
        public decimal Latitude { get; set; }
        [ForeignKey(nameof(Artist))]
        public int ArtistId { get; set; }
        public Artist? Artist { get; set; }

    }
}
