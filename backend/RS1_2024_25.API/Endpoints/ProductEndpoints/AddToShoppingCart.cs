using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using static RS1_2024_25.API.Endpoints.ProductEndpoints.AddToShoppingCartEndpoint;

namespace RS1_2024_25.API.Endpoints.ProductEndpoints
{
    public class AddToShoppingCartEndpoint : MyEndpointBaseAsync
        .WithRequest<AddToShoppingCartRequest>
        .WithResult<AddToShoppingCartResponse>
    {
        private readonly ApplicationDbContext _db;

        public AddToShoppingCartEndpoint(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpPost]
        public override async Task<AddToShoppingCartResponse> HandleAsync(
            [FromBody] AddToShoppingCartRequest request,
            CancellationToken cancellationToken = default)
        {
            var product = await _db.Products.FindAsync(request.ProductId);
            if (product == null)
            {
                return new AddToShoppingCartResponse
                {
                    Success = false,
                    Message = "Product not found."
                };
            }
            if (product.QtyInStock == 0)
            {
                return new AddToShoppingCartResponse
                {
                    Success = false,
                    Message = "No more product in stock."
                };
            }
            var existingCartItem = await _db.UserShoppingCart
                .FirstOrDefaultAsync(c => c.ProductId == request.ProductId && c.UserId == request.UserId, cancellationToken);

            if (existingCartItem != null)
            {
                existingCartItem.Quantity += request.Quantity;
                _db.UserShoppingCart.Update(existingCartItem);
            }
            else
            {
                var cartItem = new UserShoppingCart
                {
                    ProductId = request.ProductId,
                    UserId = request.UserId,
                    Quantity = request.Quantity,
                    DateAdded = DateTime.UtcNow
                };

                _db.UserShoppingCart.Add(cartItem);
            }

            await _db.SaveChangesAsync(cancellationToken);

            return new AddToShoppingCartResponse
            {
                Success = true,
                Message = "Product added to shopping cart successfully."
            };
        }

        public class AddToShoppingCartRequest
        {
            public required int ProductId { get; set; }
            public required int UserId { get; set; }
            public int Quantity { get; set; } = 1; 
        }

        public class AddToShoppingCartResponse
        {
            public required bool Success { get; set; }
            public required string Message { get; set; }
        }
    }
}
