using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using static RS1_2024_25.API.Endpoints.ProductEndpoints.RemoveFromShoppingCartEndpoint;

namespace RS1_2024_25.API.Endpoints.ProductEndpoints
{
    public class RemoveFromShoppingCartEndpoint : MyEndpointBaseAsync
    .WithRequest<RemoveFromShoppingCartRequest>
    .WithResult<RemoveFromShoppingCartResponse>
    {
        private readonly ApplicationDbContext _db;

        public RemoveFromShoppingCartEndpoint(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpPost]
        public override async Task<RemoveFromShoppingCartResponse> HandleAsync(
            [FromBody] RemoveFromShoppingCartRequest request,
            CancellationToken cancellationToken = default)
        {
            var cartItem = await _db.UserShoppingCart
                .FirstOrDefaultAsync(c => c.ProductId == request.ProductId && c.UserId == request.UserId, cancellationToken);

            if (cartItem == null)
            {
                return new RemoveFromShoppingCartResponse
                {
                    Success = false,
                    Message = "Item not found in shopping cart."
                };
            }

            _db.UserShoppingCart.Remove(cartItem);
            await _db.SaveChangesAsync(cancellationToken);

            return new RemoveFromShoppingCartResponse
            {
                Success = true,
                Message = "Product removed from shopping cart successfully."
            };
        }

        public class RemoveFromShoppingCartRequest
        {
            public required int ProductId { get; set; }
            public required int UserId { get; set; }
        }

        public class RemoveFromShoppingCartResponse
        {
            public required bool Success { get; set; }
            public required string Message { get; set; }
        }
    }

}
