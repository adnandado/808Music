using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;

namespace RS1_2024_25.API.Endpoints.PlaylistEndpoints
{
    public class PlaylistTracksGetEndpoint(ApplicationDbContext db)
        : MyEndpointBaseAsync.WithRequest<PlaylistTracksGetRequest>.WithActionResult<PlaylistTracksGetResponse>
    {
        [Authorize]
        [HttpGet]
        public override async Task<ActionResult<PlaylistTracksGetResponse>> HandleAsync([FromQuery] PlaylistTracksGetRequest request, CancellationToken cancellationToken = default)
        {
            var playlist = await db.Playlists
                .Where(p => p.Id == request.PlaylistId)
                .Select(p => new
                {
                    p.Id,
                    p.Title
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (playlist == null)
                return NotFound($"Playlist with ID {request.PlaylistId} not found.");

            var tracks = await db.PlaylistTracks
                .Where(pt => pt.PlaylistId == request.PlaylistId)
                .OrderBy(pt => pt.TrackOrder)
                .Select(pt => new TrackBasicInfo
                {
                    Id = pt.TrackId,
                    Title = pt.Track.Title,
                    Length = pt.Track.Length,
                    Streams = pt.Track.Streams,
                    IsExplicit = pt.Track.isExplicit
                })
                .ToListAsync(cancellationToken);

            var response = new PlaylistTracksGetResponse
            {
                PlaylistId = playlist.Id,
                PlaylistTitle = playlist.Title,
                Tracks = tracks
            };

            return Ok(response);
        }
    }

    public class PlaylistTracksGetRequest
    {
        public int PlaylistId { get; set; }
    }

    public class PlaylistTracksGetResponse
    {
        public int PlaylistId { get; set; }
        public string PlaylistTitle { get; set; }
        public List<TrackBasicInfo> Tracks { get; set; } = new List<TrackBasicInfo>();
    }

    public class TrackBasicInfo
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int Length { get; set; } 
        public int Streams { get; set; }
        public bool IsExplicit { get; set; }
    }
}
