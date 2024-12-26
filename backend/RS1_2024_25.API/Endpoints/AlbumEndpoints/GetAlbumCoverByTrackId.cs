using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using System.Threading;
using System.Threading.Tasks;

namespace RS1_2024_25.API.Endpoints.TrackEndpoints
{
    public class GetAlbumCoverByTrackIdEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public GetAlbumCoverByTrackIdEndpoint(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        [Route("api/tracks/{trackId}/cover")]
        public async Task<ActionResult<AlbumCoverResponse>> HandleAsync(int trackId, CancellationToken cancellationToken = default)
        {
            var track = await _db.Tracks
                .Include(t => t.Album)
                .FirstOrDefaultAsync(t => t.Id == trackId, cancellationToken);

            if (track == null || track.Album == null)
            {
                return NotFound(new { Message = "Track or Album not found" });
            }

            return new AlbumCoverResponse
            {
                TrackId = trackId,
                AlbumId = track.Album.Id,
                CoverPath = track.Album.CoverPath
            };
        }
    }

    public class AlbumCoverResponse
    {
        public required int TrackId { get; set; }
        public required int AlbumId { get; set; }
        public string CoverPath { get; set; } = string.Empty;
    }
}
