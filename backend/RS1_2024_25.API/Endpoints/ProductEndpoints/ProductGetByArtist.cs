using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;

namespace RS1_2024_25.API.Endpoints.ProductEndpoints
{
    public class ProductGetByArtistEndpoint : MyEndpointBaseAsync.WithRequest<int>.WithResult<ProductGetByArtistEndpoint.ProductGetByArtistResponse[]>
    {
        private readonly ApplicationDbContext _db;

        public ProductGetByArtistEndpoint(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet("api/ProductGetByArtist/{artistId}")]
        public override async Task<ProductGetByArtistResponse[]> HandleAsync(int artistId, CancellationToken cancellationToken = default)
        {
            var result = await _db.Products
                .Where(p => p.ArtistId == artistId )  // Filtriranje prema ArtistId
                .Include(p => p.Photos)
                .Include(p => p.Artist)
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

        public class ProductGetByArtistResponse
        {   public required string Slug { get; set; }
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
