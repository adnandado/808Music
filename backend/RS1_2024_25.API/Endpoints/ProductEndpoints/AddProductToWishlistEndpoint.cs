using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using System.Threading;
using System.Threading.Tasks;
using static RS1_2024_25.API.Endpoints.ProductEndpoints.AddProductToWishlistEndpoint;
using Microsoft.EntityFrameworkCore;

namespace RS1_2024_25.API.Endpoints.ProductEndpoints
{
    public class AddProductToWishlistEndpoint : MyEndpointBaseAsync
        .WithRequest<AddProductToWishlistRequest>
        .WithResult<AddProductToWishlistResponse>
    {
        private readonly ApplicationDbContext _db;

        public AddProductToWishlistEndpoint(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpPost]
        public override async Task<AddProductToWishlistResponse> HandleAsync(
            [FromBody] AddProductToWishlistRequest request,
            CancellationToken cancellationToken = default)
        {
            var product = await _db.Products
                .FirstOrDefaultAsync(p => p.Slug == request.ProductSlug, cancellationToken);

            if (product == null)
            {
                return new AddProductToWishlistResponse
                {
                    Success = false,
                    Message = "Product not found."
                };
            }
            product.WishlistedTimes++;
            var existingWishlistItem = await _db.UserProductWishlist
                .FirstOrDefaultAsync(w => w.ProductId == product.Id && w.UserId == request.UserId, cancellationToken);

            if (existingWishlistItem != null)
            {
                return new AddProductToWishlistResponse
                {
                    Success = false,
                    Message = "Product already in wishlist."
                };
            }

            var wishlistItem = new UserProductWishlist
            {
                ProductId = product.Id,
                UserId = request.UserId,
                DateAdded = DateTime.UtcNow
            };

            _db.UserProductWishlist.Add(wishlistItem);
            await _db.SaveChangesAsync(cancellationToken);

            return new AddProductToWishlistResponse
            {
                Success = true,
                Message = "Product added to wishlist successfully."
            };
        }

        public class AddProductToWishlistRequest
        {
            public required string ProductSlug { get; set; }  
            public required int UserId { get; set; }
        }

        public class AddProductToWishlistResponse
        {
            public required bool Success { get; set; }
            public required string Message { get; set; }
        }
    }
}
