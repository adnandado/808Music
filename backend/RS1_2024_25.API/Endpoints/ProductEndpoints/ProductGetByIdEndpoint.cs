using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using static RS1_2024_25.API.Endpoints.CityEndpoints.ProductGetByIdEndpoint;

namespace RS1_2024_25.API.Endpoints.CityEndpoints;

public class ProductGetByIdEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
    .WithRequest<int>
    .WithResult<ProductGetByIdResponse>
{
    [HttpGet("{id}")]
    public override async Task<ProductGetByIdResponse> HandleAsync(int id, CancellationToken cancellationToken = default)
    {
        var product = await db.Products
                            .Where(p => p.Id == id)
                            .Select(p => new ProductGetByIdResponse
                            {
                                ID = p.Id,
                                Title = p.Title,
                                Price = p.Price,
                                Quantity = p.QtyInStock,
                                isDigital = p.IsDigital
                            })
                            .FirstOrDefaultAsync(x => x.ID == id, cancellationToken);

        if (product == null)
            throw new KeyNotFoundException("Product not found");

        return product;
    }

    public class ProductGetByIdResponse
    {
         public required int ID { get; set; }
            public required string Title { get; set; }
            public required float Price { get; set; }
            public int Quantity { get; set; }
            public bool isDigital { get; set; }
    }
}
