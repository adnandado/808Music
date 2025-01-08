using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;

namespace RS1_2024_25.API.Endpoints.TrackEndpoints
{
    public class TrackAddStreamEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync.WithRequest<int>.WithoutResult
    {
        [Authorize]
        [HttpPost("{id}")]
        public override async Task HandleAsync(int id, CancellationToken cancellationToken = default)
        {
            Track? track = await db.Tracks.FindAsync(id, cancellationToken);

            if (track == null)
            {
                return;
            }

            track.Streams++;
            var newStream = new TrackStream
            {
                TrackId = track.Id,
                StreamedAt = DateTime.UtcNow 
            };

            await db.TrackStream.AddAsync(newStream, cancellationToken);
            await db.SaveChangesAsync(cancellationToken);
            return;
        }
    }
}
