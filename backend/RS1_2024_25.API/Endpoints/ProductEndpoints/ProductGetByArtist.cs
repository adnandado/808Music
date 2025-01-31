using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;

namespace RS1_2024_25.API.Endpoints.ProductEndpoints
{
    public class ProductGetByArtistEndpoint : MyEndpointBaseAsync.WithRequest<ProductGetByArtistEndpoint.ProductGetByArtistRequest>.WithResult<ProductGetByArtistEndpoint.ProductGetByArtistResponse[]>
    {
        private readonly ApplicationDbContext _db;

        public ProductGetByArtistEndpoint(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public override async Task<ProductGetByArtistResponse[]> HandleAsync(
            [FromQuery] ProductGetByArtistRequest request,
            CancellationToken cancellationToken = default)
        {
            var query = _db.Products
                .Where(p => p.ArtistId == request.ArtistId)
                .Include(p => p.Photos)
                .Include(p => p.Artist)
                .AsQueryable();

            if (request.MinPrice.HasValue)
                query = query.Where(p => p.Price >= request.MinPrice.Value);

            if (request.MaxPrice.HasValue)
                query = query.Where(p => p.Price <= request.MaxPrice.Value);

            if (!string.IsNullOrWhiteSpace(request.SearchQuery))
                query = query.Where(p => p.Title.Contains(request.SearchQuery));

            if (request.SortByPrice != null)
            {
                query = request.SortByPrice == "asc"
                    ? query.OrderBy(p => p.Price)
                    : query.OrderByDescending(p => p.Price);
            }

            if (request.SortBySaleAmount != null)
            {
                query = request.SortBySaleAmount == "asc"
                    ? query.OrderBy(p => p.SaleAmount)
                    : query.OrderByDescending(p => p.SaleAmount);
            }

            if (request.SortByOldest != null)
            {
                query = request.SortByOldest == "true"
                    ? query.OrderBy(p => p.DateCreated)
                    : query.OrderByDescending(p => p.DateCreated);
            }

            if (request.SortByNewest != null)
            {
                query = request.SortByNewest == "true"
                    ? query.OrderByDescending(p => p.DateCreated)
                    : query.OrderBy(p => p.DateCreated);
            }

            var result = await query
                .Select(p => new ProductGetByArtistResponse
                {
                    Slug = p.Slug,
                    Title = p.Title,
                    Price = p.Price,
                    Quantity = p.QtyInStock,
                    isDigital = p.IsDigital,
                    PhotoPaths = p.Photos.Select(photo => photo.Path).ToList(),
                    Name = p.Artist.Name,
                    SaleAmount = p.SaleAmount,
                    Bio = p.Bio,
                    ProductType = p.ProductType,
                    ClothesType = p.ClothesType
                })
                .ToArrayAsync(cancellationToken);

            return result;
        }

        public class ProductGetByArtistRequest
        {
            public int ArtistId { get; set; }
            public float? MinPrice { get; set; }
            public float? MaxPrice { get; set; }
            public string? SearchQuery { get; set; }
            public string? SortByPrice { get; set; }
            public string? SortBySaleAmount { get; set; }
            public string? SortByOldest { get; set; } 
            public string? SortByNewest { get; set; }  
        }

        public class ProductGetByArtistResponse
        {
            public required string Slug { get; set; }
            public required string Title { get; set; }
            public required float Price { get; set; }
            public int Quantity { get; set; }
            public bool isDigital { get; set; }
            public List<string> PhotoPaths { get; set; } = new();
            public required string Name { get; set; }
            public decimal SaleAmount { get; set; } = 0;
            public string? Bio { get; set; }
            public ProductType ProductType { get; set; }
            public ClothesType? ClothesType { get; set; }
        }
    }
}
