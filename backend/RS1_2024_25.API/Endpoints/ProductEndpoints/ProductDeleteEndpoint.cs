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
                .Include(p => p.Photos)
                .SingleOrDefaultAsync(x => x.Slug == slug, cancellationToken);

            if (product == null)
                throw new KeyNotFoundException("Product not found");

            foreach (var photo in product.Photos)
            {
                if (!string.IsNullOrEmpty(photo.Path))
                {
                    _fileHandler.DeleteFile(_cfg["StaticFilePaths:Products"] + photo.Path);
                }
            }

            _db.ProductPhotos.RemoveRange(product.Photos);
            await _db.SaveChangesAsync(cancellationToken);

            _db.Products.Remove(product);
            await _db.SaveChangesAsync(cancellationToken);
        }
    }
}
