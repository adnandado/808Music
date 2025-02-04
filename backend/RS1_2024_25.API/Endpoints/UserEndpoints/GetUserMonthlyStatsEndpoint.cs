using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace RS1_2024_25.API.Endpoints.UserEndpoints
{
    public class GetUserMonthlyStatsEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync.WithRequest<int>.WithActionResult<UserMonthlyStatsResponse>
    {
        [HttpGet]
        public override async Task<ActionResult<UserMonthlyStatsResponse>> HandleAsync(int UserId, CancellationToken cancellationToken)
        {
            var now = DateTime.UtcNow;
            var firstDayOfMonth = new DateTime(now.Year, now.Month, 1);
            var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

            var user = await db.MyAppUsers
                .Where(u => u.ID == UserId)
                .Select(u => new { u.Username })
                .FirstOrDefaultAsync(cancellationToken);

            if (user == null)
                return NotFound();

            var monthlyStreams = await db.TrackStream
                .Where(ts => ts.UserId == UserId && ts.StreamedAt >= firstDayOfMonth && ts.StreamedAt <= lastDayOfMonth)
                .ToListAsync(cancellationToken);

            var totalStreams = monthlyStreams.Count;
            var totalMinutes = monthlyStreams
                .SelectMany(ts => db.ArtistsTracks
                    .Where(at => at.TrackId == ts.TrackId)
                    .Select(at => at.Track.Length))
                .Sum() / 60f;

            var topArtists = monthlyStreams
                .SelectMany(ts => db.ArtistsTracks
                    .Where(at => at.TrackId == ts.TrackId)
                    .Select(at => new { at.ArtistId, TrackLength = at.Track.Length, at.Artist.ProfilePhotoPath }))
                .GroupBy(x => x.ArtistId)
                .Select(g => new
                {
                    ArtistId = g.Key,
                    TotalMinutes = g.Sum(x => x.TrackLength) / 60f,
                    PfpPath = g.First().ProfilePhotoPath
                })
                .OrderByDescending(x => x.TotalMinutes)
                .Take(3)
                .ToList();

            var topSongs = monthlyStreams
                .GroupBy(ts => ts.TrackId)
                .Select(g => new
                {
                    TrackId = g.Key,
                    PlayCount = g.Count()
                })
                .OrderByDescending(x => x.PlayCount)
                .Take(5)
                .Join(db.Tracks,
                      t => t.TrackId,
                      track => track.Id,
                      (t, track) => new TopSongs
                      {
                          Id = t.TrackId,
                          Title = track.Title
                      })
                .ToList();

            var response = new UserMonthlyStatsResponse
            {
                Username = user.Username,
                Streams = totalStreams,
                MinutesStreamed = totalMinutes,
                TopArtists = topArtists.Select(a => new TopArtists { Id = a.ArtistId, Name = db.Artists.FirstOrDefault(x => x.Id == a.ArtistId)!.Name }).ToList(),
                TopSongs = topSongs,
                ArtistRankOnePfp = topArtists.ElementAtOrDefault(0)?.PfpPath,
                ArtistRankTwoPfp = topArtists.ElementAtOrDefault(1)?.PfpPath,
                ArtistRankThreePfp = topArtists.ElementAtOrDefault(2)?.PfpPath
            };

            return Ok(response);
        }
    }

    public class UserMonthlyStatsResponse
    {
        public string ArtistRankOnePfp { get; set; }
        public string ArtistRankTwoPfp { get; set; }
        public string ArtistRankThreePfp { get; set; }
        public float MinutesStreamed { get; set; }
        public int Streams { get; set; }
        public string Username { get; set; }
        public List<TopSongs> TopSongs { get; set; }
        public List<TopArtists> TopArtists { get; set; }
    }

    public class TopSongs
    {
        public int Id { get; set; }
        public string Title { get; set; }
    }

    public class TopArtists
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
