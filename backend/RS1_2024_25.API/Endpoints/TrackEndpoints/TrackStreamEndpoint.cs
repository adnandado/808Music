using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services.Interfaces;

namespace RS1_2024_25.API.Endpoints.TrackEndpoints
{
    public class TrackStreamEndpoint(ApplicationDbContext db, IMyCacheService cs, IMyFileHandler fh, IConfiguration cfg) : MyEndpointBaseAsync.WithRequest<int>.WithActionResult
    {
        //[Authorize]
        [HttpGet("{id}")]
        public override async Task<ActionResult> HandleAsync(int id, CancellationToken cancellationToken = default)
        {
            Track? track = await cs.GetAsync<Track>($"track-{id}", cancellationToken);
            if(track == null)
            {
                track = await db.Tracks.FindAsync(id);
                if (track == null)
                    return BadRequest();
                await cs.SetAsync($"track-{id}", track, cancellationToken);
            }

            var stream = await fh.GetFileAsStreamAsync(Path.Combine(cfg["StaticFilePaths:Tracks"]!, track.TrackPath));
            var file = File(stream, "audio/mpeg", enableRangeProcessing: true);

            return file;
        }
    }
}
