using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace RS1_2024_25.API.Endpoints.ArtistEndpoints
{
    public class ArtistGetBioEndpoint(ApplicationDbContext db)
        : MyEndpointBaseAsync.WithRequest<int>.WithActionResult<ArtistBioResponse>
    {
        [HttpGet]
        public override async Task<ActionResult<ArtistBioResponse>> HandleAsync(int ArtistId, CancellationToken cancellationToken = default)
        {
            var artist = await db.Artists
                .Where(a => a.Id == ArtistId)
                .Select(a => new
                {
                    a.Name,
                    a.Bio,
                    a.ProfilePhotoPath
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (artist == null)
                return NotFound("Artist not found");

            int totalStreams = await db.ArtistsTracks
                .Where(at => at.ArtistId == ArtistId)
                .SelectMany(at => at.Track.TrackStreams)
                .CountAsync(cancellationToken);

            var rankedArtists = await db.ArtistsTracks
                .GroupBy(at => at.ArtistId)
                .Select(group => new
                {
                    ArtistId = group.Key,
                    TotalStreams = group.SelectMany(at => at.Track.TrackStreams).Count()
                })
                .OrderByDescending(a => a.TotalStreams)
                .ToListAsync(cancellationToken);

            int musicRank = rankedArtists.FindIndex(a => a.ArtistId == ArtistId) + 1;

            int totalSoldAndWishlisted = await db.Products
                .Where(p => p.ArtistId == ArtistId)
                .SumAsync(p => p.SoldItems + p.WishlistedTimes, cancellationToken);

            var rankedArtistsShop = await db.Products
                .GroupBy(p => p.ArtistId)
                .Select(group => new
                {
                    ArtistId = group.Key,
                    TotalShopPoints = group.Sum(p => p.SoldItems + p.WishlistedTimes)
                })
                .OrderByDescending(a => a.TotalShopPoints)
                .ToListAsync(cancellationToken);

            int shopRank = rankedArtistsShop.FindIndex(a => a.ArtistId == ArtistId) + 1;
            DateTime fourWeeksAgo = DateTime.UtcNow.AddDays(-30);
            int monthlyListeners = await db.ArtistsTracks
                .Where(at => at.ArtistId == ArtistId)
                .SelectMany(at => at.Track.TrackStreams)
                .Where(ts => ts.StreamedAt >= fourWeeksAgo && ts.UserId != null) 
                .Select(ts => ts.UserId)
                .Distinct()
                .CountAsync(cancellationToken);



            var response = new ArtistBioResponse
            {
                ArtistName = artist.Name,
                StreamCount = totalStreams,
                MusicRank = musicRank,
                ShopRank = shopRank,
                Bio = artist.Bio,
                BackgroundPath = artist.ProfilePhotoPath,
                MonthlyListeners = monthlyListeners
            };

            return Ok(response);
        }
    }

    public class ArtistBioResponse
    {
        public string ArtistName { get; set; }
        public int StreamCount { get; set; }
        public int MusicRank { get; set; }
        public int ShopRank { get; set; }
        public string Bio { get; set; }
        public string BackgroundPath { get; set; }
        public int MonthlyListeners { get; set; }
    }
}
