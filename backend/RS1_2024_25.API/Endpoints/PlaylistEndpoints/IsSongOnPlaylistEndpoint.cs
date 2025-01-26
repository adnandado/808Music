using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using Microsoft.EntityFrameworkCore;
using static RS1_2024_25.API.Endpoints.PlaylistEndpoints.IsSongOnPlaylistEndpoint;

namespace RS1_2024_25.API.Endpoints.PlaylistEndpoints
{
    public class IsSongOnPlaylistEndpoint : MyEndpointBaseAsync
        .WithRequest<IsOnPlaylistRequest>
        .WithActionResult
    {
        private readonly ApplicationDbContext _db;

        public IsSongOnPlaylistEndpoint(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public override async Task<ActionResult> HandleAsync(
            [FromQuery] IsOnPlaylistRequest request,
            CancellationToken cancellationToken = default)
        {
            var playlist = await _db.Playlists
                .Where(p => p.UserPlaylists.Any(up => up.PlaylistId == request.PlaylistId))
                .FirstOrDefaultAsync(cancellationToken);

            if (playlist == null)
            {
                return Ok(new IsOnPlaylistResponse { isAlreadyOnPlaylist = false });
            }

            var isOnPlaylist = await _db.PlaylistTracks
                .AnyAsync(pt => pt.PlaylistId == playlist.Id && pt.TrackId == request.trackId, cancellationToken);

            return Ok(new IsOnPlaylistResponse { isAlreadyOnPlaylist = isOnPlaylist });
        }

        public class IsOnPlaylistRequest
        {
            public required int trackId { get; set; }
            public required int PlaylistId { get; set; }
        }

        public class IsOnPlaylistResponse
        {
            public required bool isAlreadyOnPlaylist { get; set; }
        }
    }
}
