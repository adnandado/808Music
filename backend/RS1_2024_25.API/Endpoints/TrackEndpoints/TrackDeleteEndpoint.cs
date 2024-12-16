using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using RS1_2024_25.API.Services.Interfaces;

namespace RS1_2024_25.API.Endpoints.TrackEndpoints
{
    public class TrackDeleteEndpoint(ApplicationDbContext db, TokenProvider tp, IMyFileHandler fh, IConfiguration cfg, DeleteService ds) : MyEndpointBaseAsync.WithRequest<int>.WithActionResult
    {
        [Authorize]
        [HttpDelete("{id}")]
        public override async Task<ActionResult> HandleAsync(int id, CancellationToken cancellationToken = default)
        {
            Track? track = await db.Tracks.FindAsync(id);
            if (track == null)
            {
                return BadRequest("Track not found!");
            }

            await db.Albums.Where(a => a.Id == track.AlbumId).LoadAsync(cancellationToken);
            bool allowedToDelete = tp.AuthorizeUserArtist(Request, track.Album!.ArtistId, ["Owner"]);
            bool isAdmin = tp.GetJwtRoleClaimValue(Request) == "Admin";

            if (!isAdmin && !allowedToDelete)
            {
                return Unauthorized();
            }

            await ds.DeleteTrackAsync(track);
            return Ok($"Track {track.Title} deleted successfully!");
        }
    }
}
