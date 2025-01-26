using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;

namespace RS1_2024_25.API.Endpoints.AlbumEndpoints
{
    public class AlbumGetSpotlightEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync.WithRequest<int>.WithActionResult<AlbumGetAllResponse>
    {
        [Authorize]
        [HttpGet("{id}")]
        public override async Task<ActionResult<AlbumGetAllResponse>> HandleAsync(int id, CancellationToken cancellationToken = default)
        {
            var hasSpotlight = await db.AlbumSpotlights.Where(a => a.ArtistId == id).Include(a => a.Album)
                .Include(a => a.Artist).Include(a => a.Album.AlbumType)
                .FirstOrDefaultAsync(cancellationToken);
            var hasAlbum = await db.Albums.Where(a => a.ReleaseDate < DateTime.Now && a.ArtistId == id && db.Tracks.Where(t => t.AlbumId == a.Id).Count() > 0).Include(a => a.Artist).Include(a => a.AlbumType)
                .OrderByDescending(a => a.ReleaseDate).FirstOrDefaultAsync(cancellationToken);

            if(hasAlbum == null)
            {

                hasAlbum = await db.ArtistsTracks.Where(t => t.ArtistId == id)
                    .Include(t => t.Track).Include(t => t.Track.Album).Include(a => a.Track.Album.Artist).Include(a => a.Track.Album.AlbumType)
                    .Select(t => t.Track.Album).OrderByDescending(a => a.ReleaseDate).Where(a => a.ReleaseDate < DateTime.Now && db.Tracks.Where(t => t.AlbumId == a.Id).Count() > 0).FirstOrDefaultAsync(cancellationToken);
                if (hasAlbum == null)
                {
                    return NotFound();
                }
            }

            if(hasSpotlight != null)
            {
                var res = new AlbumGetAllResponse
                {
                    Id = hasSpotlight.Album.Id,
                    Artist = hasSpotlight.Artist.Name,
                    ArtistId = hasSpotlight.ArtistId,
                    CoverArt = hasSpotlight.Album.CoverPath != "" ? $"/media/Images/AlbumCovers/{hasSpotlight.Album.CoverPath}" : "/media/Images/playlist_placeholder.png",
                    ReleaseDate = hasSpotlight.Album.ReleaseDate,
                    Title = hasSpotlight.Album.Title,
                    Type = hasSpotlight.Album.AlbumType.Type,
                    TrackCount = db.Tracks.Where(t => t.AlbumId == hasSpotlight.Album.Id).Count(),
                    IsHighlighted = true
                };
                return Ok(res);
            }
            else
            {
                var res = new AlbumGetAllResponse
                {
                    Id = hasAlbum.Id,
                    Artist = hasAlbum.Artist.Name,
                    ArtistId = hasAlbum.ArtistId,
                    CoverArt = hasAlbum.CoverPath != "" ? $"/media/Images/AlbumCovers/{hasAlbum.CoverPath}" : "/media/Images/playlist_placeholder.png",
                    ReleaseDate = hasAlbum.ReleaseDate,
                    Title = hasAlbum.Title,
                    Type = hasAlbum.AlbumType.Type,
                    TrackCount = db.Tracks.Where(t => t.AlbumId == hasAlbum.Id).Count(),
                    IsHighlighted = true
                };
                return Ok(res);
            }
        }
    }
}
