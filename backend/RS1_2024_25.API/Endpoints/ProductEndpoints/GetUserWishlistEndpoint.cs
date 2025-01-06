using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using static RS1_2024_25.API.Endpoints.WishlistEndpoints.GetWishlistEndpoint;

namespace RS1_2024_25.API.Endpoints.WishlistEndpoints
{
    public class GetWishlistEndpoint : MyEndpointBaseAsync
        .WithRequest<GetWishlistRequest>
        .WithResult<GetWishlistResponse>
    {
        private readonly ApplicationDbContext _db;

        public GetWishlistEndpoint(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet("api/wishlist")]
        public override async Task<GetWishlistResponse> HandleAsync(
            [FromQuery] GetWishlistRequest request,
            CancellationToken cancellationToken = default)
        {
            var wishlistItems = await _db.UserProductWishlist
                .Where(w => w.UserId == request.UserId)
                .Select(w => new WishlistItem
                {
                    ProductId = w.ProductId,

                    ProductTitle = w.Product.Title,
                    Slug = w.Product.Slug,
                    ProductPhoto = w.Product.Photos.FirstOrDefault() != null ? w.Product.Photos.FirstOrDefault().Path : null,
                    OriginalPrice = (decimal)w.Product.Price,
                    DiscountedPrice = w.Product.SaleAmount > 0
    ? (decimal)w.Product.Price * (1 - w.Product.SaleAmount)
    : (decimal)w.Product.Price,
                    DateAdded = w.DateAdded,
                    ArtistName = w.Product.Artist.Name,
                    ArtistPfp = w.Product.Artist.ProfilePhotoPath,
                    SaleAmount = w.Product.SaleAmount,
                })
                .ToListAsync(cancellationToken);

            return new GetWishlistResponse
            {
                Success = true,
                
                WishlistItems = wishlistItems,
            };
        }

        public class GetWishlistRequest
        {
            public required int UserId { get; set; }
           
        }

        public class GetWishlistResponse
        {
            public required bool Success { get; set; }
            public List<WishlistItem> WishlistItems { get; set; } = new();
            public DateTime DateAdded { get; set; }
    }

        public class WishlistItem
        {
            public required int ProductId { get; set; }
            public required string ProductTitle { get; set; }
            public required string Slug { get; set; }
            public string? ProductPhoto { get; set; }
            public required decimal OriginalPrice { get; set; }
            public required decimal SaleAmount { get; set; }
            public required decimal DiscountedPrice { get; set; }
            public required DateTime DateAdded { get; set; }
            public required string ArtistName { get; set; }
            public required string ArtistPfp { get; set; }
        }
    }
}