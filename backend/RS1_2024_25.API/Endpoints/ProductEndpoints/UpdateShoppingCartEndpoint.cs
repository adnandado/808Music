using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using static RS1_2024_25.API.Endpoints.ProductEndpoints.UpdateShoppingCartEndpoint;

namespace RS1_2024_25.API.Endpoints.ProductEndpoints
{
    public class UpdateShoppingCartEndpoint : MyEndpointBaseAsync
     .WithRequest<UpdateShoppingCartRequest>
     .WithResult<UpdateShoppingCartResponse>
    {
        private readonly ApplicationDbContext _db;

        public UpdateShoppingCartEndpoint(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpPost]
        public override async Task<UpdateShoppingCartResponse> HandleAsync(
            [FromBody] UpdateShoppingCartRequest request,
            CancellationToken cancellationToken = default)
        {
            var cartItem = await _db.UserShoppingCart
                .FirstOrDefaultAsync(c => c.ProductId == request.ProductId && c.UserId == request.UserId, cancellationToken);

            if (cartItem == null)
            {
                return new UpdateShoppingCartResponse
                {
                    Success = false,
                    Message = "Item not found in shopping cart."
                };
            }

            cartItem.Quantity = request.Quantity;
            _db.UserShoppingCart.Update(cartItem);
            await _db.SaveChangesAsync(cancellationToken);

            return new UpdateShoppingCartResponse
            {
                Success = true,
                Message = "Shopping cart updated successfully."
            };
        }

        public class UpdateShoppingCartRequest
        {
            public required int ProductId { get; set; }
            public required int UserId { get; set; }
            public required int Quantity { get; set; }
        }

        public class UpdateShoppingCartResponse
        {
            public required bool Success { get; set; }
            public required string Message { get; set; }
        }
    }

}
