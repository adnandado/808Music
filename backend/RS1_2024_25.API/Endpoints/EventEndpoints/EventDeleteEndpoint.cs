using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using RS1_2024_25.API.Services.Interfaces;

namespace RS1_2024_25.API.Endpoints.EventEndpoints
{
    public class EventDeleteEndpoint : MyEndpointBaseAsync
        .WithRequest<int>
        .WithResult<bool>
    {
        private readonly ApplicationDbContext _db;
        private readonly IMyFileHandler _fh;
        private readonly IConfiguration _cfg;


        public EventDeleteEndpoint(ApplicationDbContext db, IMyFileHandler fh, IConfiguration cfg)
        {
            _db = db;
            _fh = fh;
            _cfg = cfg;
        }

        [HttpDelete("api/EventDelete/{eventId}")]
        public override async Task<bool> HandleAsync(int eventId, CancellationToken cancellationToken = default)
        {
            var eventItem = await _db.Events.FindAsync(new object[] { eventId }, cancellationToken);

            if (eventItem == null)
                return false;

            if (!string.IsNullOrEmpty(eventItem.EventCover))
            {
                try
                {
                    _fh.DeleteFile(_cfg["StaticFilePaths:CoverImages"] + eventItem.EventCover);
                }
                catch (Exception ex)
                {
                    return false;
                }
            }

            await _db.SaveChangesAsync(cancellationToken);
            _db.Events.Remove(eventItem);
            await _db.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
