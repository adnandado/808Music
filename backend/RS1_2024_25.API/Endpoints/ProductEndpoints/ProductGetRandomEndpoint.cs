using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using static RS1_2024_25.API.Endpoints.CityEndpoints.ProductGetAllEndpoint;

namespace RS1_2024_25.API.Endpoints.ProductEndpoints
{
    public class ProductGetRandomEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
    .WithoutRequest
    .WithResult<ProductGetAllResponse[]>
    {
        [HttpGet("api/ProductGetRandom")]
        public override async Task<ProductGetAllResponse[]> HandleAsync(CancellationToken cancellationToken = default)
        {
            var randomProducts = await db.Products
                            .OrderBy(p => Guid.NewGuid())  // Nasumično sortiranje
                            .Take(5)
                            .Include(p => p.Photos)
                            .Select(p => new ProductGetAllResponse
                            {
                                Slug = p.Slug,
                                Id = p.Id,
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

            return randomProducts;
        }
    }

}
