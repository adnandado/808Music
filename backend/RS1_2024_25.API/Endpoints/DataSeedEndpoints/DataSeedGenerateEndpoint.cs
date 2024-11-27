namespace RS1_2024_25.API.Endpoints.DataSeed;

using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Helper.Api;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public class DataSeedGenerateEndpoint(ApplicationDbContext db)
    : MyEndpointBaseAsync
    .WithoutRequest
    .WithResult<string>
{
    [HttpPost]
    public override async Task<string> HandleAsync(CancellationToken cancellationToken = default)
    {
        // Kreiranje država
        var countries = new List<Country>
        {
            new Country { Name = "Bosnia and Herzegovina" },
            new Country { Name = "Croatia" },
            new Country { Name = "Germany" },
            new Country { Name = "Austria" },
            new Country { Name = "USA" }
        };

        // Kreiranje gradova
        var cities = new List<City>
        {
            new City { Name = "Sarajevo", Country = countries[0] },
            new City { Name = "Mostar", Country = countries[0] },
            new City { Name = "Zagreb", Country = countries[1] },
            new City { Name = "Berlin", Country = countries[2] },
            new City { Name = "Vienna", Country = countries[3] },
            new City { Name = "New York", Country = countries[4] },
            new City { Name = "Los Angeles", Country = countries[4] }
        };

        // Kreiranje korisnika s ulogama
        var users = new List<MyAppUser>
        {
            new MyAppUser
            {
                Username = "admin",
                Password = BCrypt.Net.BCrypt.EnhancedHashPassword("admin123"),
                FirstName = "Admin",
                LastName = "One",
                IsAdmin = true,
                IsManager = false,
                Email = "marko.dogan@edu.fit.ba",
                DateOfBirth = DateTime.Now,
                IsActive = true,
                CountryId = db.Countries.First().ID
            },
            new MyAppUser
            {
                Username = "manager",
                Password = BCrypt.Net.BCrypt.EnhancedHashPassword("manager123"),
                FirstName = "Manager",
                LastName = "One",
                IsAdmin = false,
                IsManager = true,
                Email = "adnan.grbesic@edu.fit.ba",
                DateOfBirth = DateTime.Now,
                IsActive = true,
                CountryId = db.Countries.First().ID
            },
            new MyAppUser
            {
                Username = "user808",
                Password = BCrypt.Net.BCrypt.EnhancedHashPassword("user123"),
                FirstName = "User",
                LastName = "One",
                IsAdmin = false,
                IsManager = false,
                Email = "pcrpmo@gmail.com",
                DateOfBirth = DateTime.Now,
                IsActive = true,
                CountryId = db.Countries.First().ID
            }
        };

        var artists = new List<Artist> {
            new Artist
            {
                Name = "Artist2",
                Bio = "bio of artist 2"
            },
            new Artist
            {
                Name = "Artist3",
                Bio = "bio of artist 3"
            },
            new Artist
            {
                Name = "Artist4",
                Bio = "bio of artist 3"
            }
        };

        var albumTypes = new List<AlbumType> {
            new AlbumType
            {
                Type = "Single"
            },
            new AlbumType
            {
                Type = "EP"
            },
            new AlbumType
            {
                Type = "Mixtape"
            },
            new AlbumType
            {
                Type = "Album"
            }
        };

        // Dodavanje podataka u bazu
        //await db.Countries.AddRangeAsync(countries, cancellationToken);
        //await db.Cities.AddRangeAsync(cities, cancellationToken);
        await db.MyAppUsers.AddRangeAsync(users, cancellationToken);
        //await db.AlbumTypes.AddRangeAsync(albumTypes, cancellationToken);
        //await db.Artists.AddRangeAsync(artists, cancellationToken);


        await db.SaveChangesAsync(cancellationToken);

        return "Data generation completed successfully.";
    }
}
