using System.ComponentModel.DataAnnotations;

namespace RS1_2024_25.API.Data.Models
{
    public class AlbumType
    {
        [Key]
        public int Id { get; set; }
        public string Type { get; set; }
    }
}
