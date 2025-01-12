using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using Microsoft.EntityFrameworkCore;
using static RS1_2024_25.API.Endpoints.PlaylistEndpoints.IsLikedSong;

namespace RS1_2024_25.API.Endpoints.PlaylistEndpoints
{
    public class IsLikedSong : MyEndpointBaseAsync
        .WithRequest<IsLikedSongRequest>
        .WithActionResult 
    {
        private readonly ApplicationDbContext _db;

        public IsLikedSong(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public override async Task<ActionResult> HandleAsync(
            [FromQuery] IsLikedSongRequest request,
            CancellationToken cancellationToken = default)
        {
            var likedSongsPlaylist = await _db.Playlists
                .Where(p => p.isLikePlaylist && p.UserPlaylists.Any(up => up.MyAppUserId == request.UserId))
                .FirstOrDefaultAsync(cancellationToken);

            if (likedSongsPlaylist == null)
            {
                return Ok(new IsLikedSongResponse { IsLikedSong = false });
            }

            var isLiked = await _db.PlaylistTracks
                .AnyAsync(pt => pt.PlaylistId == likedSongsPlaylist.Id && pt.TrackId == request.trackId, cancellationToken);

            return Ok(new IsLikedSongResponse { IsLikedSong = isLiked });
        }

        public class IsLikedSongRequest
        {
            public required int trackId { get; set; }
            public required int UserId { get; set; }
        }

        public class IsLikedSongResponse
        {
            public required bool IsLikedSong { get; set; }
        }
    }
}
