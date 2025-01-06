using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using System.IO;
using System.Linq;
using static ProductAddEndpoint;

public class ProductAddEndpoint : MyEndpointBaseAsync
    .WithRequest<ProductAddRequest>
    .WithResult<ProductAddResponse>
{
    private readonly ApplicationDbContext _db;

    public ProductAddEndpoint(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpPost]
    public override async Task<ProductAddResponse> HandleAsync([FromForm] ProductAddRequest request, CancellationToken cancellationToken = default)
    {   

        var product = new Product
        {
            Title = request.Title,
            Price = request.Price,
            QtyInStock = request.Quantity,
            IsDigital = request.isDigital,
            Slug = GenerateRandomSlug(),
            ArtistId = request.ArtistId,
            DateCreated = DateTime.UtcNow,
            Bio = request.Bio,
            ProductType = request.ProductType, 
            ClothesType = request.ClothesType 
        };
        if (request.ProductType != ProductType.Clothes && request.ClothesType != null)
        {
            return null ;
        }
        _db.Products.Add(product);
        await _db.SaveChangesAsync(cancellationToken);

        if (request.Photos != null && request.Photos.Any())
        {
            foreach (var photo in request.Photos)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(photo.FileName);
                var filePath = Path.Combine("wwwroot/images/products", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await photo.CopyToAsync(stream, cancellationToken);
                }

                var productPhoto = new ProductPhoto
                {
                    Path = $"/images/products/{fileName}",
                    ProductId = product.Id
                };

                _db.ProductPhotos.Add(productPhoto);
            }

            await _db.SaveChangesAsync(cancellationToken);
        }

        return new ProductAddResponse
        {
            ID = product.Id,
            Title = product.Title,
            isDigital = product.IsDigital,
            Quantity = product.QtyInStock,
            Price = product.Price,
            Slug = product.Slug,
            ArtistId = product.ArtistId
        };
    }



    private string GenerateRandomSlug(int length = 8)
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var random = new Random();
        return new string(Enumerable.Repeat(chars, length)
          .Select(s => s[random.Next(s.Length)]).ToArray());
    }

    public class ProductAddRequest
    {
        public required string Title { get; set; }
        public required float Price { get; set; }
        public int Quantity { get; set; }
        public bool isDigital { get; set; }
        public List<IFormFile> Photos { get; set; } = new();
        public int ArtistId { get; set; }
        public string? Bio { get; set; }
        public ProductType ProductType { get; set; } 
        public ClothesType? ClothesType { get; set; } 
    }



    public class ProductAddResponse
    {
        public required int ID { get; set; }
        public required string Title { get; set; }
        public required float Price { get; set; }
        public int Quantity { get; set; }
        public bool isDigital { get; set; }
        public string Slug { get; set; }
        public int ArtistId { get; set; }
        public decimal SaleAmount { get; set; } = 0;
        public string? Bio { get; set; } 
        public ProductType ProductType { get; set; }
        public ClothesType? ClothesType { get; set; }

    }
}
