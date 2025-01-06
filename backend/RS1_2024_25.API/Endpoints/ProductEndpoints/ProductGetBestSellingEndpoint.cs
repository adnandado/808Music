using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using static RS1_2024_25.API.Endpoints.CityEndpoints.ProductGetAllEndpoint;

namespace RS1_2024_25.API.Endpoints.ProductEndpoints
{
    public class ProductGetBestSellingEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
    .WithoutRequest
    .WithResult<ProductGetAllResponse[]>
    {
        [HttpGet("api/ProductGetBestSelling")]
        public override async Task<ProductGetAllResponse[]> HandleAsync(CancellationToken cancellationToken = default)
        {
            var result = await db.Products.OrderByDescending(p => p.SoldItems)
                            .Where(p => p.SoldItems > 0)
                            .Take(5)
                            .Include(p => p.Photos)
                            .Select(p => new ProductGetAllResponse
                            {
                                Slug = p.Slug,
                                Title = p.Title,
                                Price = p.Price,
                                Quantity = p.QtyInStock,
                                isDigital = p.IsDigital,
                                SaleAmount = p.SaleAmount,
                                Bio = p.Bio,
                                ProductType = p.ProductType,
                                ClothesType = p.ClothesType,
                                PhotoPaths = p.Photos.Select(photo => photo.Path).ToList()
                            })
                            .ToArrayAsync(cancellationToken);

            return result;
        }
    }

}
