using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using static RS1_2024_25.API.Endpoints.CityEndpoints.ProductGetAllEndpoint;

namespace RS1_2024_25.API.Endpoints.ProductEndpoints
{
    public class ProductGetTopWishlistedEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
    .WithoutRequest
    .WithResult<ProductGetAllResponse[]>
    {
        [HttpGet("api/ProductGetTopWishlisted")]
        public override async Task<ProductGetAllResponse[]> HandleAsync(CancellationToken cancellationToken = default)
        {
            var topWishlistedProducts = await db.Products
                .Where(p => p.WishlistedTimes > 0)
                .OrderByDescending(p => p.WishlistedTimes)
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
                .ToListAsync(cancellationToken);

            if (topWishlistedProducts.Count < 5)
            {
                var additionalProducts = await db.Products
                    .Where(p => !topWishlistedProducts.Select(tp => tp.Id).Contains(p.Id))
                    .OrderByDescending(p => p.WishlistedTimes) 
                    .Take(5 - topWishlistedProducts.Count)
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
                    .ToListAsync(cancellationToken);

                topWishlistedProducts.AddRange(additionalProducts);
            }

            return topWishlistedProducts.ToArray();
        }
    }
}