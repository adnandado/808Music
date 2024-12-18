using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using static RS1_2024_25.API.Endpoints.CityEndpoints.ProductGetAllEndpoint;

namespace RS1_2024_25.API.Endpoints.CityEndpoints;

public class ProductGetAllEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
    .WithoutRequest
    .WithResult<ProductGetAllResponse[]>
{
    [HttpGet("api/ProductGetAll")]
    public override async Task<ProductGetAllResponse[]> HandleAsync(CancellationToken cancellationToken = default)
    {
        var result = await db.Products.Include(p => p.Photos)
                        .Select(p => new ProductGetAllResponse
                        {
                            Slug = p.Slug,
                            Title = p.Title,
                            Price = p.Price,
                            Quantity = p.QtyInStock,
                            isDigital = p.IsDigital,
                            PhotoPaths = p.Photos.Select(photo => photo.Path).ToList()
                        })
                        .ToArrayAsync(cancellationToken);

        return result;
    }

    public class ProductGetAllResponse
    {
        public required string Slug { get; set; }
        public required string Title { get; set; }
        public required float Price { get; set; }
        public int Quantity { get; set; }
        public bool isDigital { get; set; }
        public List<string> PhotoPaths { get; set; } = new();
    }
}
