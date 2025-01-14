using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using System.Threading;
using System.Threading.Tasks;
using static RS1_2024_25.API.Endpoints.ProductEndpoints.RemoveProductFromWishlistEndpoint;
using Microsoft.EntityFrameworkCore;

namespace RS1_2024_25.API.Endpoints.ProductEndpoints
{
    public class RemoveProductFromWishlistEndpoint : MyEndpointBaseAsync
        .WithRequest<RemoveProductFromWishlistRequest>
        .WithResult<RemoveProductFromWishlistResponse>
    {
        private readonly ApplicationDbContext _db;

        public RemoveProductFromWishlistEndpoint(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpPost]
        public override async Task<RemoveProductFromWishlistResponse> HandleAsync(
            [FromBody] RemoveProductFromWishlistRequest request,
            CancellationToken cancellationToken = default)
        {
            var product = await _db.Products
                .FirstOrDefaultAsync(p => p.Slug == request.ProductSlug, cancellationToken);

            if (product == null)
            {
                return new RemoveProductFromWishlistResponse
                {
                    Success = false,
                    Message = "Product not found."
                };
            }

            var existingWishlistItem = await _db.UserProductWishlist
                .FirstOrDefaultAsync(w => w.ProductId == product.Id && w.UserId == request.UserId, cancellationToken);

            if (existingWishlistItem == null)
            {
                return new RemoveProductFromWishlistResponse
                {
                    Success = false,
                    Message = "Product not found in wishlist."
                };
            }

            product.WishlistedTimes--;
            _db.UserProductWishlist.Remove(existingWishlistItem);
            await _db.SaveChangesAsync(cancellationToken);

            return new RemoveProductFromWishlistResponse
            {   

                Success = true,
                Message = "Product removed from wishlist successfully."
            };
        }

        public class RemoveProductFromWishlistRequest
        {
            public required string ProductSlug { get; set; }  
            public required int UserId { get; set; } 
        }

        public class RemoveProductFromWishlistResponse
        {
            public required bool Success { get; set; }
            public required string Message { get; set; }
        }
    }
}
