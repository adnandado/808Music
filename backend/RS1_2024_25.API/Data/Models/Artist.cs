using System.ComponentModel.DataAnnotations;

namespace RS1_2024_25.API.Data.Models
{
    public class Artist
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
        public string ProfilePhotoPath { get; set; } = string.Empty;
        public string ProfileBackgroundPath { get; set; } = string.Empty;
        public int Followers {  get; set; }
    }
}
