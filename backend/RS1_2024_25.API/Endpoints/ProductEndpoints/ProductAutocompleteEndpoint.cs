using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using static RS1_2024_25.API.Endpoints.CityEndpoints.ProductAutocompleteEndpoint;

namespace RS1_2024_25.API.Endpoints.CityEndpoints;

public class ProductAutocompleteEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
    .WithRequest<ProductAutocompleteRequest>
    .WithResult<ProductAutocompleteResponse[]>
{
    [HttpGet("api/ProductAutocomplete")]
    public override async Task<ProductAutocompleteResponse[]> HandleAsync([FromQuery] ProductAutocompleteRequest request, CancellationToken cancellationToken = default)
    {
        var keyword = request.Keyword?.ToLower() ?? string.Empty;

        var result = await db.Products
            .Include(p => p.Photos)
            .Where(p => p.Title.ToLower().Contains(keyword))
            .Take(10)  // Limiting to 10 results for performance
            .Select(p => new ProductAutocompleteResponse
            {
                Slug = p.Slug,
                Title = p.Title,
                Id = p.Id,
                Price = p.Price,
                Quantity = p.QtyInStock,
                IsDigital = p.IsDigital,
                Bio = p.Bio,
                ProductType = p.ProductType,
                ClothesType = p.ClothesType,
                DateCreated = p.DateCreated,
                PhotoPaths = p.Photos.Select(photo => photo.Path).ToList()
            })
            .ToArrayAsync(cancellationToken);

        return result;
    }


    public class ProductAutocompleteRequest
    {
        public string? Keyword { get; set; }
    }

    public class ProductAutocompleteResponse
    {
        public required string Slug { get; set; }
        public int Id { get; set; }
        public required string Title { get; set; }
        public required float Price { get; set; }
        public int Quantity { get; set; }
        public bool IsDigital { get; set; }
        public string? Bio { get; set; }
        public ProductType ProductType { get; set; }
        public ClothesType? ClothesType { get; set; }
        public DateTime DateCreated { get; set; }
        public List<string> PhotoPaths { get; set; } = new();
    }
}
