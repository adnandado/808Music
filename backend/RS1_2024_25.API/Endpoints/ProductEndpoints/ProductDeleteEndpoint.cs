namespace RS1_2024_25.API.Endpoints.CityEndpoints
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using RS1_2024_25.API.Data;
    using RS1_2024_25.API.Data.Models;
    using RS1_2024_25.API.Helper.Api;
    using System.Threading;
    using System.Threading.Tasks;
    using System.IO;
    using RS1_2024_25.API.Services.Interfaces;

    public class ProductDeleteEndpoint : MyEndpointBaseAsync
        .WithRequest<string>
        .WithoutResult
    {
        private readonly ApplicationDbContext _db;
        private readonly IMyFileHandler _fileHandler;
        private readonly IConfiguration _cfg;

        public ProductDeleteEndpoint(ApplicationDbContext db, IMyFileHandler fileHandler, IConfiguration cfg)
        {
            _db = db;
            _fileHandler = fileHandler;
            _cfg = cfg;
        }

        [HttpDelete("{slug}")]
        public override async Task HandleAsync(string slug, CancellationToken cancellationToken = default)
        {
            var product = await _db.Products
                .SingleOrDefaultAsync(x => x.Slug == slug, cancellationToken);

            if (product == null)
                throw new KeyNotFoundException("Product not found");

            var orderDetails = _db.OrderDetails.Where(od => od.ProductId == product.Id);
            _db.OrderDetails.RemoveRange(orderDetails);

            var userProductWishlists = _db.UserProductWishlist.Where(upw => upw.ProductId == product.Id);
            _db.UserProductWishlist.RemoveRange(userProductWishlists);

            var userShoppingCarts = _db.UserShoppingCart.Where(usc => usc.ProductId == product.Id);
            _db.UserShoppingCart.RemoveRange(userShoppingCarts);

            var productPhotos = _db.ProductPhotos.Where(p => p.ProductId == product.Id);
            foreach (var photo in productPhotos)
            {
                if (!string.IsNullOrEmpty(photo.Path))
                {
                    _fileHandler.DeleteFile(_cfg["StaticFilePaths:Products"] + photo.Path);
                }
                if (!string.IsNullOrEmpty(photo.ThumbnailPath))
                {
                    _fileHandler.DeleteFile(_cfg["StaticFilePaths:Products"] + photo.ThumbnailPath);
                }
            }

            _db.ProductPhotos.RemoveRange(productPhotos);
            await _db.SaveChangesAsync(cancellationToken);

            _db.Products.Remove(product);
            await _db.SaveChangesAsync(cancellationToken);
        }


    }
}
