using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using System.IO;
using System.Linq;
using static ProductAddEndpoint;

public class ProductAddEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
    .WithRequest<ProductAddRequest>
    .WithResult<ProductAddResponse>
{
    [HttpPost]
    public override async Task<ProductAddResponse> HandleAsync([FromForm] ProductAddRequest request, CancellationToken cancellationToken = default)
    {
        var product = new Product
        {
            Title = request.Title,
            Price = request.Price,
            QtyInStock = request.Quantity,
            IsDigital = request.isDigital,
            Slug = GenerateRandomSlug()
        };

        db.Products.Add(product);
        await db.SaveChangesAsync(cancellationToken);


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

                db.ProductPhotos.Add(productPhoto);
            }

            await db.SaveChangesAsync(cancellationToken);
        }

        return new ProductAddResponse
        {
            ID = product.Id,
            Title = product.Title,
            isDigital = product.IsDigital,
            Quantity = product.QtyInStock,
            Price = product.Price,
            Slug = product.Slug
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
    }

    public class ProductAddResponse
    {
        public required int ID { get; set; }
        public required string Title { get; set; }
        public required float Price { get; set; }
        public int Quantity { get; set; }
        public bool isDigital { get; set; }
        public string Slug { get; set; }
    }
}
