﻿using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using static RS1_2024_25.API.Endpoints.ProductEndpoints.IsProductOnWishlistEndpoint;

namespace RS1_2024_25.API.Endpoints.ProductEndpoints
{
    public class IsProductOnWishlistEndpoint : MyEndpointBaseAsync
        .WithRequest<IsProductOnWishlistRequest>
        .WithResult<IsProductOnWishlistResponse>
    {
        private readonly ApplicationDbContext _db;

        public IsProductOnWishlistEndpoint(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public override async Task<IsProductOnWishlistResponse> HandleAsync(
            [FromQuery] IsProductOnWishlistRequest request,
            CancellationToken cancellationToken = default)
        {
            var product = await _db.Products
                .FirstOrDefaultAsync(p => p.Slug == request.ProductSlug, cancellationToken);

            if (product == null)
            {
                return new IsProductOnWishlistResponse
                {
                    IsOnWishlist = false,
                    Message = "Product not found."
                };
            }

            var existingWishlistItem = await _db.UserProductWishlist
                .FirstOrDefaultAsync(w => w.ProductId == product.Id && w.UserId == request.UserId, cancellationToken);

            return new IsProductOnWishlistResponse
            {
                IsOnWishlist = existingWishlistItem != null,
                Message = existingWishlistItem != null ? "Product is already on wishlist." : "Product is not on wishlist."
            };
        }

        public class IsProductOnWishlistRequest
        {
            public required string ProductSlug { get; set; }  
            public required int UserId { get; set; }          
        }

        public class IsProductOnWishlistResponse
        {
            public required bool IsOnWishlist { get; set; }  
            public required string Message { get; set; }     
        }
    }
}
