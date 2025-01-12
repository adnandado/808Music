using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace RS1_2024_25.API.Endpoints.PlaylistEndpoints
{
    public class GetPlaylistsByUserIdEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public GetPlaylistsByUserIdEndpoint(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        [Route("api/playlists/user/{userId}")]
        public async Task<ActionResult<PlaylistResponse>> GetPlaylistsByUserIdAsync(int userId, CancellationToken cancellationToken = default)
        {
            var user = await _db.MyAppUsers.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var playlists = await _db.UserPlaylist
                                     .Where(up => up.MyAppUserId == userId)
                                     .Include(up => up.Playlist)
                                     .Select(up => new PlaylistResponse
                                     {
                                         ID = up.Playlist.Id,
                                         Title = up.Playlist.Title,
                                         NumOfTracks = up.Playlist.NumOfTracks,
                                         IsPublic = up.Playlist.IsPublic,
                                         CoverPath = up.Playlist.CoverPath,
                                         Username = user.Username 
                                     })
                                     .ToListAsync(cancellationToken);

            if (playlists == null || playlists.Count == 0)
            {
                return NotFound("No playlists by this user.");
            }

            return Ok(playlists);
        }

        public class PlaylistResponse
        {
            public required int ID { get; set; }
            public required string Title { get; set; }
            public int NumOfTracks { get; set; }
            public bool IsPublic { get; set; }
            public string CoverPath { get; set; } = string.Empty;
            public string Username { get; set; } = string.Empty; // Dodajemo polje za username
        }
    }
}
