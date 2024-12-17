namespace RS1_2024_25.API.Endpoints.CityEndpoints
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using RS1_2024_25.API.Data;
    using RS1_2024_25.API.Data.Models;
    using RS1_2024_25.API.Helper.Api;
    using System.Threading;
    using System.Threading.Tasks;

    //[MyAuthorization(isAdmin: true, isManager: false)]
    public class ProductDeleteEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
        .WithRequest<string>
        .WithoutResult
    {
        [HttpDelete("{slug}")]
        public override async Task HandleAsync(string slug, CancellationToken cancellationToken = default)
        {

            var product = await db.Products
                .Include(p => p.Photos)
                .SingleOrDefaultAsync(x => x.Slug == slug, cancellationToken);

            if (product == null)
                throw new KeyNotFoundException("Product not found");


            db.ProductPhotos.RemoveRange(product.Photos);

            await db.SaveChangesAsync(cancellationToken);

            db.Products.Remove(product);
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
