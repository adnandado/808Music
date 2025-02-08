using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using Microsoft.EntityFrameworkCore;
using static GetArtistDashboardEndpoint;
using RS1_2024_25.API.Helper;

public class GetArtistDashboardEndpoint : MyEndpointBaseAsync
    .WithRequest<GetArtistDashboardRequest>
    .WithResult<GetArtistDashboardResponse>
{
    private readonly ApplicationDbContext _db;

    public GetArtistDashboardEndpoint(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public override async Task<GetArtistDashboardResponse> HandleAsync(
        [FromQuery] GetArtistDashboardRequest request,
        CancellationToken cancellationToken = default)
    {
        var artist = await _db.Artists
            .Where(a => a.Id == request.ArtistId)
            .FirstOrDefaultAsync(cancellationToken);

        if (artist == null)
        {
            return new GetArtistDashboardResponse
            {
                Success = false,
                ErrorMessage = "Artist not found"
            };
        }

        var totalStreams = await _db.ArtistsTracks
            .Where(at => at.ArtistId == request.ArtistId)
            .SumAsync(at => at.Track.Streams, cancellationToken);

        var followers = await _db.Follows
            .Where(f => f.ArtistId == request.ArtistId)
            .Select(f => new FollowerStats
            {
                FollowerId = f.MyAppUserId,
                FollowerName = f.MyAppUser.Username,
                StartedFollowing = f.StartedFollowing
            })
            .ToListAsync(cancellationToken);

        var lastFollowerDate = followers
            .OrderByDescending(f => f.StartedFollowing)
            .FirstOrDefault()?.StartedFollowing;

        var last5Followers = followers
            .OrderByDescending(f => f.StartedFollowing)
            .ToList();

        var productSales = await _db.Products
            .Where(p => p.ArtistId == request.ArtistId)
            .Select(p => new ProductSalesStats
            {
                ProductId = p.Id,
                ProductTitle = p.Title,
                QuantitySold = p.SoldItems,
                TotalRevenue = (decimal)p.RevenueFromProduct
            })
            .ToListAsync(cancellationToken);

        var highestPriceSold = productSales
          .Where(ps => ps.QuantitySold > 0)
          .OrderByDescending(ps => ps.TotalRevenue)
          .ToList();

        var mostSales = productSales
            .Where(ps => ps.QuantitySold > 0)
            .OrderByDescending(ps => ps.QuantitySold)
            .ToList();
        var last5Products = await _db.OrderDetails
    .Where(od => od.Product.ArtistId == request.ArtistId)  
    .OrderByDescending(od => od.Order.DateAdded)  
    .Select(od => new ProductSalesStats
    {
        ProductId = od.Product.Id,
        ProductTitle = od.Product.Title,
        QuantitySold = od.Quantity,
        TotalRevenue = od.Quantity * (od.UnitPrice * (1-od.Discount))
    })
    .ToListAsync(cancellationToken);

        var totalRevenueAllProducts = await _db.Products
            .Where(p => p.ArtistId == request.ArtistId)
            .SumAsync(p => p.RevenueFromProduct, cancellationToken);

        var currentDate = DateTime.UtcNow;
        var currentWeekStart = currentDate.StartOfWeek(DayOfWeek.Monday);
        var statsByWeek = new List<WeeklyStatsData>();
        int currentWeekFollowersCount = 0;
        int lastWeekFollowersCount = 0;

        for (int i = 0; i < 4; i++)
        {
            var weekStart = currentWeekStart.AddDays(-7 * i);
            var weekEnd = weekStart.AddDays(7);

            var streamsThisWeekForLoop = await _db.ArtistsTracks
                .Where(at => at.ArtistId == request.ArtistId)
                .SelectMany(at => at.Track.TrackStreams)
                .CountAsync(ts => ts.StreamedAt >= weekStart && ts.StreamedAt < weekEnd, cancellationToken);

            var followersThisWeekCountInLoop = followers
                .Count(f => f.StartedFollowing >= weekStart && f.StartedFollowing < weekEnd);

            var revenueThisWeekForLoop = await _db.OrderDetails
                .Join(_db.Order, od => od.OrderId, o => o.Id, (od, o) => new { od, o })
                .Where(x => x.o.DateAdded >= weekStart && x.o.DateAdded < weekEnd)
                .Where(x => x.od.Product.ArtistId == request.ArtistId)
                .SumAsync(x => x.od.Quantity * x.od.UnitPrice, cancellationToken);

            statsByWeek.Add(new WeeklyStatsData
            {
                Streams = streamsThisWeekForLoop,
                Followers = followersThisWeekCountInLoop,
                Revenue = revenueThisWeekForLoop,
                WeekStart = weekStart,
                WeekEnd = weekEnd
            });

            if (i == 0)
            {
                currentWeekFollowersCount = followersThisWeekCountInLoop;
            }
            else if (i == 1)
            {
                lastWeekFollowersCount = followersThisWeekCountInLoop;
            }
        }

        var lastWeekStart = currentWeekStart.AddDays(-7);
        var lastWeekEnd = currentWeekStart.AddDays(-1);

        var followersThisWeekCount = followers.Count(f => f.StartedFollowing >= currentWeekStart);
        var followersLastWeekCount = followers.Count(f => f.StartedFollowing >= lastWeekStart && f.StartedFollowing < currentWeekStart);

        decimal followerGrowthPercentage = 0;
        bool isFollowerGrowthPositive = false;

        if (followersLastWeekCount == 0 && followersThisWeekCount > 0)
        {
            followerGrowthPercentage = 100;
            isFollowerGrowthPositive = true;
        }
        else if (followersLastWeekCount > 0)
        {
            var growth = ((decimal)(followersThisWeekCount - followersLastWeekCount) / followersLastWeekCount) * 100;
            followerGrowthPercentage = Math.Abs(growth);
            isFollowerGrowthPositive = growth >= 0;
        }

        var revenueThisWeekForTotal = await _db.OrderDetails
            .Join(_db.Order, od => od.OrderId, o => o.Id, (od, o) => new { od, o })
            .Where(x => x.o.DateAdded >= currentWeekStart && x.o.DateAdded < currentDate)
            .Where(x => x.od.Product.ArtistId == request.ArtistId)
            .SumAsync(x => x.od.Quantity * x.od.UnitPrice, cancellationToken);

        var revenueLastWeekForTotal = await _db.OrderDetails
            .Join(_db.Order, od => od.OrderId, o => o.Id, (od, o) => new { od, o })
            .Where(x => x.o.DateAdded >= lastWeekStart && x.o.DateAdded < currentWeekStart)
               .Where(x => x.od.Product.ArtistId == request.ArtistId)
            .SumAsync(x => x.od.Quantity * x.od.UnitPrice, cancellationToken);

        decimal revenueGrowthPercentage = 0;
        bool isRevenueGrowthPositive = false;

        if (revenueLastWeekForTotal == 0 && revenueThisWeekForTotal > 0)
        {
            revenueGrowthPercentage = 100;
            isRevenueGrowthPositive = true;
        }
        else if (revenueLastWeekForTotal > 0)
        {
            var growth = ((revenueThisWeekForTotal - revenueLastWeekForTotal) / revenueLastWeekForTotal) * 100;
            revenueGrowthPercentage = Math.Abs(growth);
            isRevenueGrowthPositive = growth >= 0;

        }
        var last5Streams = await _db.ArtistsTracks
           .Where(at => at.ArtistId == request.ArtistId)
           .SelectMany(at => at.Track.TrackStreams)
           .OrderByDescending(sd => sd.StreamedAt)
           .Select(sd => new StreamStats
           {
               TrackId = sd.TrackId,
               TrackTitle = sd.Track.Title,
               StreamedAt = sd.StreamedAt
           })
           .ToListAsync(cancellationToken);

        var streamsThisWeekForTotal = await _db.ArtistsTracks
            .Where(at => at.ArtistId == request.ArtistId)
            .SelectMany(at => at.Track.TrackStreams)
            .CountAsync(ts => ts.StreamedAt >= currentWeekStart, cancellationToken);

        var streamsLastWeekForTotal = await _db.ArtistsTracks
            .Where(at => at.ArtistId == request.ArtistId)
            .SelectMany(at => at.Track.TrackStreams)
            .CountAsync(ts => ts.StreamedAt >= lastWeekStart && ts.StreamedAt < currentWeekStart, cancellationToken);

        decimal streamGrowthPercentage = 0;
        bool isStreamGrowthPositive = false;

        if (streamsLastWeekForTotal == 0 && streamsThisWeekForTotal > 0)
        {
            streamGrowthPercentage = 100;
            isStreamGrowthPositive = true;
        }
        else if (streamsLastWeekForTotal > 0)
        {
            var growth = ((decimal)(streamsThisWeekForTotal - streamsLastWeekForTotal) / streamsLastWeekForTotal) * 100;
            streamGrowthPercentage = Math.Abs(growth); 
            isStreamGrowthPositive = growth >= 0;
        }

        bool revenueGrowth = isRevenueGrowthPositive;
        bool streamGrowth = isStreamGrowthPositive;
        bool followerGrowth = isFollowerGrowthPositive;
        statsByWeek.Reverse();
        return new GetArtistDashboardResponse
        {
            Success = true,
            TotalStreams = totalStreams,
            TotalFollowers = followers.Count,
            TotalRevenueAllProducts = totalRevenueAllProducts,
            FollowerGrowth = followerGrowth,
            FollowerGrowthPercentage = followerGrowthPercentage,
            IsFollowerGrowthPositive = isFollowerGrowthPositive,
            RevenueGrowth = revenueGrowth,
            StreamGrowth = streamGrowth,
            RevenueGrowthPercentage = revenueGrowthPercentage,
            StreamGrowthPercentage = streamGrowthPercentage,
            LastStreams = last5Streams,
            LastFollowerDate = lastFollowerDate,
            Followers = last5Followers,
            ProductSales = last5Products,
            StatsByWeek = statsByWeek,
            SaleAmount = highestPriceSold,
            QuantitySold = mostSales,
        };
    }

    public class GetArtistDashboardRequest
    {
        public required int ArtistId { get; set; }
    }

    public class GetArtistDashboardResponse
    {
        public required bool Success { get; set; }
        public string? ErrorMessage { get; set; }
        public int TotalStreams { get; set; }
        public int TotalFollowers { get; set; }
        public decimal TotalRevenueAllProducts { get; set; }
        public DateTime? LastFollowerDate { get; set; }
        public List<FollowerStats> Followers { get; set; } = new();
        public List<ProductSalesStats> ProductSales { get; set; } = new();
        public List<ProductSalesStats> QuantitySold { get; set; } = new();
        public List<ProductSalesStats> SaleAmount { get; set; } = new();


        public List<WeeklyStatsData> StatsByWeek { get; set; } = new();
        public List<StreamStats> LastStreams { get; set; } = new();
        public bool FollowerGrowth { get; set; }
        public decimal FollowerGrowthPercentage { get; set; }
        public bool StreamGrowth { get; set; }
        public decimal StreamGrowthPercentage { get; set; }
        public bool RevenueGrowth { get; set; }
        public decimal RevenueGrowthPercentage { get; set; }
        public bool IsFollowerGrowthPositive { get; set; }
    }

    public class FollowerStats
    {
        public required int FollowerId { get; set; }
        public required string FollowerName { get; set; }
        public required DateTime StartedFollowing { get; set; }
    }

    public class ProductSalesStats
    {
        public required int ProductId { get; set; }
        public required string ProductTitle { get; set; }
        public required int QuantitySold { get; set; }
        public required decimal TotalRevenue { get; set; }
    }

    public class WeeklyStatsData
    {
        public int Streams { get; set; }
        public int Followers { get; set; }
        public decimal Revenue { get; set; }
        public DateTime WeekStart { get; set; }
        public DateTime WeekEnd { get; set; }
    }
    public class StreamStats
    {
        public required int TrackId { get; set; }
        public required string TrackTitle { get; set; }
        public required DateTime StreamedAt { get; set; }
    }
}
