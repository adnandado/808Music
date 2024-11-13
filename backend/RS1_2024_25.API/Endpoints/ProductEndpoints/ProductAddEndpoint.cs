using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using static RS1_2024_25.API.Endpoints.ProductAddEndpoint.ProductAddEndpoint;

namespace RS1_2024_25.API.Endpoints.ProductAddEndpoint;

public class ProductAddEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
    .WithRequest<ProductAddRequest>
    .WithResult<ProductAddResponse>
{
    [HttpPost]
    public override async Task<ProductAddResponse> HandleAsync([FromBody] ProductAddRequest request, CancellationToken cancellationToken = default)
    {
        var product = new Product
        {
            Title = request.Title,
            Price = request.Price,
            QtyInStock = request.Quantity,
            IsDigital = request.isDigital

        };

        db.Products.Add(product);
        await db.SaveChangesAsync(cancellationToken);

        return new ProductAddResponse
        {
            ID = product.Id,
            Title = product.Title,
            isDigital = product.IsDigital,
            Quantity = product.QtyInStock,
            Price = product.Price
        };
    }

    public class ProductAddRequest
    {
        public required string Title { get; set; }
        public required float Price { get; set; }
        public int Quantity { get; set; }
        public bool isDigital { get; set; }
    }

    public class ProductAddResponse
    {
        public required int ID { get; set; }
        public required string Title { get; set; }
        public required float Price { get; set; }
        public int Quantity { get; set; }
        public bool isDigital { get; set; }
    }
}
