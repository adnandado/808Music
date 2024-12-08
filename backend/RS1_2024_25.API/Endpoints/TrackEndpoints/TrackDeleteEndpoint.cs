using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.TrackEndpoints
{
    public class TrackDeleteEndpoint(ApplicationDbContext db, TokenProvider tp, FileHandler fh, IConfiguration cfg) : MyEndpointBaseAsync.WithRequest<int>.WithActionResult
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

            var artistTracks = await db.ArtistsTracks.Where(at => at.TrackId == id).ToListAsync();
            var trackGenres = await db.TrackGenres.Where(at => at.TrackId == id).ToListAsync();
            var credits = await db.Credits.FindAsync(id);
            //also remove from playlists when added

            db.ArtistsTracks.RemoveRange(artistTracks);
            db.TrackGenres.RemoveRange(trackGenres);
            if(credits != null)
            {
                db.Credits.Remove(credits);
            }

            await db.SaveChangesAsync();

            fh.DeleteFile(cfg["StaticFilePaths:Tracks"] + track.TrackPath);

            db.Tracks.Remove(track);

            await db.SaveChangesAsync();

            return Ok();
        }
    }
}
