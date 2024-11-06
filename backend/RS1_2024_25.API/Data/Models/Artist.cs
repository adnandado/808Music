using System.ComponentModel.DataAnnotations;

namespace RS1_2024_25.API.Data.Models
{
    public class Artist
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Bio { get; set; }
        public string ProfilePhotoPath { get; set; }
        public string ProfileBackgroundPath { get; set; }
        public int Followers {  get; set; }
    }
}
