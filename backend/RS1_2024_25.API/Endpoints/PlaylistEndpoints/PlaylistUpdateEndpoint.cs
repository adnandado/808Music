using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Diagnostics;

[ApiController]
[Route("api/playlists")]
public class PlaylistUpdateTracksEndpoint : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public PlaylistUpdateTracksEndpoint(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpPost]
    [Route("update-tracks")]
    public async Task<IActionResult> UpdateTracksAsync([FromBody] PlaylistUpdateTracksRequest request, CancellationToken cancellationToken = default)
    {
        var playlist = await _db.Playlists.FindAsync(request.PlaylistId);

        if (playlist == null)
            return NotFound($"Playlist with ID {request.PlaylistId} not found.");

        Debug.WriteLine($"Before adding tracks, NumOfTracks: {playlist.NumOfTracks}");

        int localNumOfTracks = playlist.NumOfTracks;

        foreach (var trackId in request.TrackIds)
        {
            var exists = _db.PlaylistTracks.Any(pt => pt.PlaylistId == request.PlaylistId && pt.TrackId == trackId);
            if (!exists)
            {
                var playlistTrack = new PlaylistTracks
                {
                    PlaylistId = playlist.Id,
                    TrackId = trackId,
                    TrackOrder = localNumOfTracks 
                };

                _db.PlaylistTracks.Add(playlistTrack);
                Debug.WriteLine($"Added track: {trackId}");

                localNumOfTracks++;
            }
            else
            {
                Debug.WriteLine($"Track {trackId} already exists in playlist.");
            }
        }

        playlist.NumOfTracks = localNumOfTracks;

        _db.Playlists.Update(playlist);
        await _db.SaveChangesAsync(cancellationToken);

        return Ok();
    }
}

public class PlaylistUpdateTracksRequest
{
    public required int PlaylistId { get; set; }
    public List<int> TrackIds { get; set; } = new();
}
