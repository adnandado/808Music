using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data.Models.Mail;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using static ProductUpdateEndpoint;
using System.Text;
using NAudio.Utils;
using System.Runtime.ConstrainedExecution;

public class ProductUpdateEndpoint : MyEndpointBaseAsync
    .WithRequest<ProductUpdateRequest>
    .WithResult<ProductUpdateResponse>
{
    private readonly ApplicationDbContext _db;
    private readonly IMyMailService _mailService;
    private readonly IConfiguration _configuration;

    public ProductUpdateEndpoint(ApplicationDbContext db, IMyMailService mailService, IConfiguration configuration)
    {
        _db = db;
        _mailService = mailService;
        _configuration = configuration;
    }

    [HttpPut]
    public override async Task<ProductUpdateResponse> HandleAsync([FromForm] ProductUpdateRequest request, CancellationToken cancellationToken = default)
    {
        var product = await _db.Products.FirstOrDefaultAsync(p => p.Slug == request.Slug, cancellationToken);
        if (product == null)
        {
            throw new Exception("Product not found");
        }

        bool isSaleAmountChanged = product.SaleAmount != Math.Round(request.SaleAmount, 2) / 100;

        product.Title = request.Title;
        product.Price = request.Price;
        product.QtyInStock = request.Quantity;
        product.IsDigital = request.isDigital;
        product.SaleAmount = Math.Round(request.SaleAmount, 2) / 100;
        product.Bio = request.Bio;

        _db.Products.Update(product);
        await _db.SaveChangesAsync(cancellationToken);

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

                _db.ProductPhotos.Add(productPhoto);
            }
        }

        await _db.SaveChangesAsync(cancellationToken);

        if (isSaleAmountChanged)
        {
            var wishlistedUsers = await _db.UserProductWishlist
                .Where(wishlist => wishlist.ProductId == product.Id)
                .Include(wishlist => wishlist.MyAppUser)
                .ToListAsync(cancellationToken);

            foreach (var wishlist in wishlistedUsers)
            {
                var user = wishlist.MyAppUser;

                var mailBody = new StringBuilder();
                mailBody.Append("<html><body style='background-color: #f0f0f0; margin: 0; padding: 0;'>");
                mailBody.Append("<div style='width: 100%; background-color: #f0f0f0; padding: 20px; box-sizing: border-box;'>");
                mailBody.Append("<img src='https://i.imgur.com/gZqaDjj.png' alt='Order Confirmation' style='width: 100px; height: auto; display: block; margin: 20px auto;' />");
                mailBody.Append("<div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;'>");
                mailBody.Append($"<h2>Hi {user.Username},</h2>");
                mailBody.Append($"<p>The product <strong>{product.Title}</strong> is now on sale!</p>");
                mailBody.Append($"<p>New price: <strong>${(decimal)product.Price * (1 - product.SaleAmount):F2}</strong> (Discount: {product.SaleAmount * 100:F0}%)</p>");
                mailBody.Append($"<p style='font-size: 7px;'>You're receiving this email because you have this product wishlisted</p>");

                mailBody.Append("</div>");
                mailBody.Append("</div>");
                mailBody.Append("</body></html>");

                await _mailService.Send(new MailData
                {
                    Subject = $"{product.Title.ToUpper()} - from your wishlist - IS NOW {product.SaleAmount * 100:F0}% OFF!",
                    IsBodyHtml = true,
                    To = user.Email,
                    Body = mailBody
                });
            }
        }

        return new ProductUpdateResponse
        {
            ID = product.Id,
            Title = product.Title,
            isDigital = product.IsDigital,
            Quantity = product.QtyInStock,
            Price = product.Price,
            SaleAmount = product.SaleAmount,
            Bio = product.Bio,
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
        public string Bio { get; set; }
    }

    public class ProductUpdateResponse
    {
        public required int ID { get; set; }
        public required string Title { get; set; }
        public required float Price { get; set; }
        public int Quantity { get; set; }
        public bool isDigital { get; set; }
        public decimal SaleAmount { get; set; } = 0;
        public string Bio { get; set; }
    }
}
