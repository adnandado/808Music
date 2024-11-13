using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using static RS1_2024_25.API.Endpoints.CityEndpoints.ProductGetAll1Endpoint;

namespace RS1_2024_25.API.Endpoints.CityEndpoints;

public class ProductGetAll1Endpoint(ApplicationDbContext db) : MyEndpointBaseAsync
    .WithoutRequest
    .WithResult<ProductGetAllResponse[]>
{
    [HttpGet]
    public override async Task<ProductGetAllResponse[]> HandleAsync(CancellationToken cancellationToken = default)
    {
        var result = await db.Products
                        .Select(p => new ProductGetAllResponse
                        {
                            ID = p.Id,
                            Title = p.Title,
                            Price = p.Price,
                            Quantity = p.QtyInStock,
                            isDigital = p.IsDigital

                        })
                        .ToArrayAsync(cancellationToken);

        return result;
    }

    public class ProductGetAllResponse
    {
        public required int ID { get; set; }
        public required string Title { get; set; }
        public required float Price { get; set; }
        public int Quantity { get; set; }
        public bool isDigital { get; set; }
    }
}