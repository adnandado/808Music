using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;

namespace RS1_2024_25.API.Endpoints.UserEndpoints
{
    public class GetUserArtistStatsEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync.WithRequest<GetUserArtistStatsRequest>.WithActionResult<GetUserArtistStatsResponse>
    {
        [HttpGet]
        public override async Task<ActionResult<GetUserArtistStatsResponse>> HandleAsync([FromQuery] GetUserArtistStatsRequest request, CancellationToken cancellationToken)
        {
            var userProfile = await db.MyAppUsers
                .Where(u => u.ID == request.UserId)
                .Select(u => u.pfpCoverPath)
                .FirstOrDefaultAsync(cancellationToken);

            var artistProfile = await db.Artists
                .Where(a => a.Id == request.ArtistId)
                .Select(a => a.ProfilePhotoPath)
                .FirstOrDefaultAsync(cancellationToken);

            var likedSongsCount = await db.UserPlaylist
                .Where(up => up.MyAppUserId == request.UserId && up.Playlist.isLikePlaylist)
                .SelectMany(up => up.Playlist.PlaylistTracks)
                .Where(pt => db.ArtistsTracks
                    .Any(at => at.TrackId == pt.TrackId && at.ArtistId == request.ArtistId))
                .CountAsync(cancellationToken);

            var minutesPlayed = await db.TrackStream
                .Where(ts => ts.UserId == request.UserId)
                .SelectMany(ts => db.ArtistsTracks
                    .Where(at => at.TrackId == ts.TrackId && at.ArtistId == request.ArtistId)
                    .Select(at => at.Track.Length))
                .SumAsync(length => length, cancellationToken);

            var userFollowInfo = await db.Follows
                .Where(f => f.MyAppUserId == request.UserId && f.ArtistId == request.ArtistId)
                .Select(f => f.StartedFollowing)
                .FirstOrDefaultAsync(cancellationToken);

            int daysFollowing = 0;
            if (userFollowInfo != default)
            {
                daysFollowing = (DateTime.UtcNow - userFollowInfo).Days;
            }

            var userTotalMinutesByArtist = await db.TrackStream
                .Where(ts => ts.UserId == request.UserId) 
                .SelectMany(ts => db.ArtistsTracks
                    .Where(at => at.TrackId == ts.TrackId)  
                    .Select(at => new
                    {
                        ArtistId = at.ArtistId,
                        TrackLength = at.Track.Length 
                    }))
                .GroupBy(x => x.ArtistId)  
                .Select(g => new
                {
                    ArtistId = g.Key,
                    TotalMinutes = g.Sum(x => x.TrackLength) 
                })
                .Where(x => x.TotalMinutes > 0)  
                .OrderByDescending(x => x.TotalMinutes)  
                .ToListAsync(cancellationToken);

            var rankedArtists = userTotalMinutesByArtist
                .Select((x, index) => new
                {
                    ArtistId = x.ArtistId,
                    Rank = index + 1  
                })
                .ToList();

           
            var artistRank = rankedArtists
                .FirstOrDefault(x => x.ArtistId == request.ArtistId)?.Rank ?? 0;

            var response = new GetUserArtistStatsResponse
            {
                DaysFollowing = daysFollowing,
                MinutesPlayed = minutesPlayed / 60f, 
                LikedSongs = likedSongsCount,
                UserProfilePicture = userProfile,
                ArtistProfilePicture = artistProfile,
                ArtistRank = artistRank
            };

            return Ok(response);  
        }

    }

    public class GetUserArtistStatsRequest
    {
        public int UserId { get; set; }
        public int ArtistId { get; set; }
    }

    public class GetUserArtistStatsResponse
    {
        public int DaysFollowing { get; set; }
        public float MinutesPlayed { get; set; }
        public int LikedSongs { get; set; }
        public int ArtistRank { get; set;  }
        public string UserProfilePicture { get; set; }
        public string ArtistProfilePicture { get; set; }
    }
}
