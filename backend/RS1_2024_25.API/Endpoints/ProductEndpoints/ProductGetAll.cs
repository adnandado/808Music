using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
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
                            Id = p.Id,
                            Price = p.Price,
                            Quantity = p.QtyInStock,
                            isDigital = p.IsDigital,
                            SaleAmount = p.SaleAmount,
                            Bio = p.Bio,
                            ProductType = p.ProductType,
                            ClothesType = p.ClothesType,
                            DateCreated = p.DateCreated,
                            PhotoPaths = p.Photos.Select(photo => photo.Path).ToList()

                        })
                        .ToArrayAsync(cancellationToken);

        return result;
    }

    public class ProductGetAllResponse
    {
        public required string Slug { get; set; }
        public int Id { get; set; }
        public required string Title { get; set; }
        public required float Price { get; set; }
        public int Quantity { get; set; }
        public bool isDigital { get; set; }
        public List<string> PhotoPaths { get; set; } = new();
        public decimal SaleAmount { get; set; } = 0;
        public string? Bio { get; set; } 
        public ProductType ProductType { get; set; }
        public ClothesType? ClothesType { get; set; }
        public DateTime DateCreated { get; set; }
        public decimal DiscountedPrice { get; internal set; }
    }
}
