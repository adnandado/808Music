using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace RS1_2024_25.API.Data.Models.Auth;

public class MyAppUser
{
    [Key]
    public int ID { get; set; }
    public string Username { get; set; }
    [JsonIgnore]
    public string Password { get; set; }

    // Additional properties
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public DateTime DateOfBirth { get; set; }
    public ICollection<UserPlaylist> UserPlaylists { get; set; }

    [ForeignKey(nameof(Country))]
    public int CountryId { get; set; }
    public Country Country { get; set; }
    public bool IsActive { get; set; }

    //public bool Gender { get; set; }

    //----------------
    public bool IsAdmin { get; set; }
    public bool IsManager { get; set; }
    public string pfpCoverPath { get; set; } = string.Empty;

    [ForeignKey(nameof(Subscription))]
    public int? SubscriptionId { get; set; }
    public Subscription? Subscription { get; set; }
    public string HeaderColor { get; set; } = "#000000";

    public ICollection<UserOrders> UserOrders { get; set; }  // Veza prema narudžbama
    /*
     
     Ako sistem nije zamišljen da podržava česte promjene rola i 
     ako se dodavanje novih rola svodi na manje promjene u kodu, 
    tada može biti dovoljno koristiti boolean polja kao što su IsAdmin, IsManager itd. 
    
    Ovaj pristup je jednostavan i efektivan u situacijama gdje su role stabilne i unaprijed definirane.

    Međutim, glavna prednost korištenja role entiteta dolazi do izražaja kada aplikacija potencijalno raste i 
    zahtjeva kompleksnije role i ovlaštenja. U scenarijima gdje se očekuje veći broj različitih rola ili kompleksniji 
    sistem ovlaštenja, dodavanje nove bool varijable može postati nepraktično i otežati održavanje.

    Dakle, za stabilne sisteme s manjim brojem fiksnih rola, boolean polja su sasvim razumno rješenje.
     */

}
