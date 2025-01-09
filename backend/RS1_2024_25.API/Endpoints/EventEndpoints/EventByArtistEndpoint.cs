using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;

namespace RS1_2024_25.API.Endpoints.EventEndpoints
{
    public class EventGetByArtistEndpoint : MyEndpointBaseAsync
        .WithRequest<int>
        .WithResult<EventGetByArtistEndpoint.EventGetByArtistResponse[]>
    {
        private readonly ApplicationDbContext _db;

        public EventGetByArtistEndpoint(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet("api/EventGetByArtist/{artistId}")]
        public override async Task<EventGetByArtistResponse[]> HandleAsync(int artistId, CancellationToken cancellationToken = default)
        {
            var currentDate = DateTime.UtcNow;
            var events = await _db.Events
                .Where(e => e.ArtistId == artistId && e.EventDate >= currentDate)
                .OrderBy(e => e.EventDate) 

                .Select(e => new EventGetByArtistResponse
                {
                    Id = e.Id,
                    City = e.City,
                    Country = e.Country,
                    EventDate = e.EventDate,
                    Venue = e.Venue,
                    EventTitle = e.EventTitle,
                    EventCover = e.EventCover
                })
                .ToArrayAsync(cancellationToken);

            return events;
        }

        public class EventGetByArtistResponse
        {
            public int Id { get; set; }
            public string City { get; set; }
            public required string EventTitle { get; set; }

            public string Country { get; set; }
            public DateTime EventDate { get; set; }
            public string Venue { get; set; }
            public string? EventCover { get; set; }
        }
    }
}
