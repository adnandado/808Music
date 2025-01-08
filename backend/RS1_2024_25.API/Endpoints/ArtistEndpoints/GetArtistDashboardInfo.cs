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

        var last5Streams = await _db.ArtistsTracks
            .Where(at => at.ArtistId == request.ArtistId)
            .SelectMany(at => at.Track.TrackStreams)
            .OrderByDescending(sd => sd.StreamedAt)
            .Take(5)
            .Select(sd => new StreamStats
            {
                TrackId = sd.TrackId,
                TrackTitle = sd.Track.Title,
                StreamedAt = sd.StreamedAt
            })
            .ToListAsync(cancellationToken);

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
            .Take(5)
            .ToList();

        var productSales = await _db.Products
            .Where(p => p.ArtistId == request.ArtistId)
            .Select(p => new ProductSalesStats
            {
                ProductId = p.Id,
                ProductTitle = p.Title,
                QuantitySold = p.SoldItems,
                TotalRevenue = p.SoldItems * (decimal)p.Price
            })
            .ToListAsync(cancellationToken);

        var totalRevenueAllProducts = await _db.Products
     .Where(p => p.ArtistId == request.ArtistId)
     .SumAsync(p => p.RevenueFromProduct, cancellationToken);

        var last5Sales = productSales
            .Where(ps => ps.QuantitySold > 0)
            .OrderByDescending(ps => ps.QuantitySold) 
            .Take(5)
            .ToList();

       
        var currentDate = DateTime.UtcNow;

        var currentWeekStart = currentDate.StartOfWeek(DayOfWeek.Monday);

        var currentWeekEnd = currentWeekStart.AddDays(7);

        var lastWeekStart = currentWeekStart.AddDays(-7);

        var lastWeekEnd = currentWeekStart.AddDays(-1);


        var followersThisWeek = followers
            .Count(f => f.StartedFollowing >= currentWeekStart);

        var followersLastWeek = followers
            .Count(f => f.StartedFollowing >= lastWeekStart && f.StartedFollowing < currentWeekStart);

        bool followerGrowth = followersThisWeek > followersLastWeek;

        var query = from od in _db.OrderDetails
                    join o in _db.Order on od.OrderId equals o.Id
                    join p in _db.Products on od.ProductId equals p.Id
                    where o.DateAdded >= currentWeekStart && o.DateAdded < currentWeekEnd
                    select new
                    {
                        Revenue = od.Quantity * od.UnitPrice, 
                        OrderDate = o.DateAdded
                    };


        var lastWeekQuery = from od in _db.OrderDetails
                            join o in _db.Order on od.OrderId equals o.Id
                            join p in _db.Products on od.ProductId equals p.Id
                            where o.DateAdded >= lastWeekStart && o.DateAdded < currentWeekStart
                            select new
                            {
                                Revenue = od.Quantity * od.UnitPrice, 
                                OrderDate = o.DateAdded
                            };
        var revenueThisWeek = await query.SumAsync(x => x.Revenue, cancellationToken);
        var revenueLastWeek = await lastWeekQuery.SumAsync(x => x.Revenue, cancellationToken);

        bool isRevenueThisWeekHigher = revenueThisWeek > revenueLastWeek;




        var streamsThisWeek = await _db.ArtistsTracks
    .Where(at => at.ArtistId == request.ArtistId)
    .SelectMany(at => at.Track.TrackStreams)
    .CountAsync(ts => ts.StreamedAt >= currentWeekStart, cancellationToken);

        var streamsLastWeek = await _db.ArtistsTracks
            .Where(at => at.ArtistId == request.ArtistId)
            .SelectMany(at => at.Track.TrackStreams)
            .CountAsync(ts => ts.StreamedAt >= lastWeekStart && ts.StreamedAt < currentWeekStart, cancellationToken);

        bool streamGrowth = streamsThisWeek > streamsLastWeek;
   
        decimal followerGrowthPercentage = 0;
        bool isFollowerGrowthPositive = false;

        if (followersLastWeek == 0 && followersThisWeek > 0)
        {
            followerGrowthPercentage = 100; 
            isFollowerGrowthPositive = true;
        }
        else if (followersLastWeek > 0)
        {
            var growth = ((decimal)(followersThisWeek - followersLastWeek) / followersLastWeek) * 100;
            followerGrowthPercentage = Math.Abs(growth);
            isFollowerGrowthPositive = growth >= 0;
        }

      
        decimal revenueGrowthPercentage = 0;
        bool isRevenueGrowthPositive = false;

        if (revenueLastWeek == 0 && revenueThisWeek > 0)
        {
            revenueGrowthPercentage = 100; 
            isRevenueGrowthPositive = true;
        }
        else if (revenueLastWeek > 0)
        {
            var growth = ((revenueThisWeek - revenueLastWeek) / revenueLastWeek) * 100;
            revenueGrowthPercentage = Math.Abs(growth); 
            isRevenueGrowthPositive = growth >= 0; 
        }

        
        decimal streamGrowthPercentage = 0;
        bool isStreamGrowthPositive = false;

        if (streamsLastWeek == 0 && streamsThisWeek > 0)
        {
            streamGrowthPercentage = 100; 
            isStreamGrowthPositive = true;
        }
        else if (streamsLastWeek > 0)
        {
            var growth = ((decimal)(streamsThisWeek - streamsLastWeek) / streamsLastWeek) * 100;
            streamGrowthPercentage = Math.Abs(growth); 
            isStreamGrowthPositive = growth >= 0;
        }



        return new GetArtistDashboardResponse
        {
            Success = true,
            TotalStreams = totalStreams,
            TotalFollowers = followers.Count,
            TotalRevenueAllProducts = totalRevenueAllProducts,
            FollowerGrowth = followerGrowth,
            RevenueGrowth = isRevenueThisWeekHigher,
            StreamGrowth = streamGrowth,
            LastFollowerDate = lastFollowerDate,
            Followers = last5Followers,
            ProductSales = last5Sales,
            LastStreams = last5Streams,
            ArtistName = artist.Name,
            FollowerGrowthPercentage = followerGrowthPercentage,  
            RevenueGrowthPercentage = revenueGrowthPercentage,
            StreamGrowthPercentage = streamGrowthPercentage,

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
        public List<StreamStats> LastStreams { get; set; } = new();
        public string ArtistName { get; set; } = string.Empty;

        public bool FollowerGrowth { get; set; }
        public bool RevenueGrowth { get; set; }
        public bool StreamGrowth { get; set; }
        public decimal StreamGrowthPercentage { get; set; }
        public decimal RevenueGrowthPercentage { get; set; }
        public decimal FollowerGrowthPercentage { get; set; }
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

    public class StreamStats
    {
        public required int TrackId { get; set; }
        public required string TrackTitle { get; set; }
        public required DateTime StreamedAt { get; set; }
    }
}
