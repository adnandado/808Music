using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.TrackEndpoints
{
    public class TrackAddStreamEndpoint(ApplicationDbContext db, TokenProvider token) : MyEndpointBaseAsync.WithRequest<int>.WithoutResult
    {
        [Authorize]
        [HttpPost("{id}")]
        public override async Task HandleAsync(int id, CancellationToken cancellationToken = default)
        {
            string userId = token.GetJwtSub(HttpContext.Request);
            int userIdInt = int.Parse(userId);

            Track? track = await db.Tracks.FindAsync(id, cancellationToken);

            if (track == null)
            {
                return;
            }

            track.Streams++;
            var newStream = new TrackStream
            {
                TrackId = track.Id,
                StreamedAt = DateTime.UtcNow,
                UserId = userIdInt,
            };

            await db.TrackStream.AddAsync(newStream, cancellationToken);
            await db.SaveChangesAsync(cancellationToken);
            return;
        }
    }
}
