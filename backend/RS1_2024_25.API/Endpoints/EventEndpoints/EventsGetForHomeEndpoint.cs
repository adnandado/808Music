using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;

namespace RS1_2024_25.API.Endpoints.EventEndpoints
{
    public class EventGetUpcomingEndpoint : MyEndpointBaseAsync
        .WithoutRequest
        .WithResult<EventGetUpcomingEndpoint.EventGetUpcomingResponse[]>
    {
        private readonly ApplicationDbContext _db;

        public EventGetUpcomingEndpoint(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public override async Task<EventGetUpcomingResponse[]> HandleAsync(CancellationToken cancellationToken = default)
        {
            var currentDate = DateTime.UtcNow;
            var events = await _db.Events
                .Where(e => e.EventDate >= currentDate)
                .OrderBy(e => e.EventDate)
                .Take(5) 
                .Select(e => new EventGetUpcomingResponse
                {
                    Id = e.Id,
                    City = e.City,
                    Country = e.Country,
                    EventDate = e.EventDate,
                    Venue = e.Venue,
                    EventTitle = e.EventTitle,
                    EventCover = e.EventCover,
                    Longitude = e.Longitude,
                    Latitude = e.Latitude,
                })
                .ToArrayAsync(cancellationToken);

            return events;
        }

        public class EventGetUpcomingResponse
        {
            public int Id { get; set; }
            public string City { get; set; }
            public string Country { get; set; }
            public DateTime EventDate { get; set; }
            public string Venue { get; set; }
            public string EventTitle { get; set; }
            public string? EventCover { get; set; }
            public decimal Longitude { get; set; }
            public decimal Latitude { get; set; }
        }
    }
}
