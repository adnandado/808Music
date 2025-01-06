using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using static GetShoppingCartEndpoint;
using Microsoft.EntityFrameworkCore;

public class GetShoppingCartEndpoint : MyEndpointBaseAsync
    .WithRequest<GetShoppingCartRequest>
    .WithResult<GetShoppingCartResponse>
{
    private readonly ApplicationDbContext _db;

    public GetShoppingCartEndpoint(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public override async Task<GetShoppingCartResponse> HandleAsync(
        [FromQuery] GetShoppingCartRequest request,
        CancellationToken cancellationToken = default)
    {
        var cartItems = await _db.UserShoppingCart
            .Where(c => c.UserId == request.UserId)
            .Select(c => new ShoppingCartItem
            {
                ProductId = c.ProductId,
                ProductTitle = c.Product.Title,
                ProductPhoto = c.Product.Photos.FirstOrDefault() != null ? c.Product.Photos.FirstOrDefault().Path : null,
                ProductPrice = (decimal)c.Product.Price,
                Quantity = c.Quantity,
               
                DiscountedPrice = c.Product.SaleAmount > 0
    ? (decimal)c.Product.Price * (1 - c.Product.SaleAmount)
    : (decimal)c.Product.Price,
                TotalPrice = c.Quantity *
             
              (decimal)c.Product.Price * (1 - (decimal)c.Product.SaleAmount ),

            })
            .ToListAsync(cancellationToken);

        return new GetShoppingCartResponse
        {
            Success = true,
            CartItems = cartItems
        };
    }

    public class GetShoppingCartRequest
    {
        public required int UserId { get; set; }
    }

    public class GetShoppingCartResponse
    {
        public required bool Success { get; set; }
        public List<ShoppingCartItem> CartItems { get; set; } = new();
    }

    public class ShoppingCartItem
    {
        public required int ProductId { get; set; }
        public required string ProductTitle { get; set; }
        public string? ProductPhoto { get; set; }
        public required decimal ProductPrice { get; set; }
        public required int Quantity { get; set; }
        public required decimal TotalPrice { get; set; }
       public required decimal DiscountedPrice { get; set; }
    }
}
