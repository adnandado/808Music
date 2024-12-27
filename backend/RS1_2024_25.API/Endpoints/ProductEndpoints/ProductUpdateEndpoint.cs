using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using static ProductUpdateEndpoint;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

public class ProductUpdateEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
    .WithRequest<ProductUpdateRequest>
    .WithResult<ProductUpdateResponse>
{
    [HttpPut]
    public override async Task<ProductUpdateResponse> HandleAsync([FromForm] ProductUpdateRequest request, CancellationToken cancellationToken = default)
    {
        var product = await db.Products.FirstOrDefaultAsync(p => p.Slug == request.Slug);
        if (product == null)
        {
            throw new Exception("Product not found");
        }

        product.Title = request.Title;
        product.Price = request.Price;
        product.QtyInStock = request.Quantity;
        product.IsDigital = request.isDigital;
        product.SaleAmount = (decimal)Math.Round(request.SaleAmount, 2) / 100;
        Debug.WriteLine(product.SaleAmount.ToString());
        db.Products.Update(product);
        await db.SaveChangesAsync(cancellationToken);

        if (request.Photos != null && request.Photos.Any())
        {
            string uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "products");
            if (!Directory.Exists(uploadFolder))
            {
                Directory.CreateDirectory(uploadFolder);
            }

            foreach (var photo in request.Photos)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(photo.FileName);
                var filePath = Path.Combine(uploadFolder, fileName);

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
        }

        await db.SaveChangesAsync(cancellationToken);

        return new ProductUpdateResponse
        {
            ID = product.Id,
            Title = product.Title,
            isDigital = product.IsDigital,
            Quantity = product.QtyInStock,
            Price = product.Price,
            SaleAmount = product.SaleAmount,   

        };
    }

    public class ProductUpdateRequest
    {
        public required string Slug { get; set; }
        public required string Title { get; set; }
        public required float Price { get; set; }
        public int Quantity { get; set; }
        public bool isDigital { get; set; }
        public List<IFormFile> Photos { get; set; } = new();
        public List<int> RemovePhotoIds { get; set; } = new();
        public decimal SaleAmount { get; set; } = 0;
    }

    public class ProductUpdateResponse
    {
        public required int ID { get; set; }
        public required string Title { get; set; }
        public required float Price { get; set; }
        public int Quantity { get; set; }
        public bool isDigital { get; set; }
        public decimal SaleAmount { get; set; } = 0;
    }
}
