using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using static RS1_2024_25.API.Endpoints.CityEndpoints.ProductGetAllEndpoint;

namespace RS1_2024_25.API.Endpoints.ProductEndpoints
{
    [ApiController]
    [Route("api/products")]
    public class ProductController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public ProductController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet("bytype")]
        public async Task<IActionResult> GetProductsByType(
            [FromQuery] ProductType productType,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string sortBy = "title",
            CancellationToken cancellationToken = default)
        {
            // Provjera da li je korisnik odabrao validan tip proizvoda
            if (!Enum.IsDefined(typeof(ProductType), productType))
            {
                return BadRequest("Invalid product type.");
            }

            // Ukupni broj proizvoda u toj kategoriji
            var total = await _db.Products
                .Where(p => p.ProductType == productType)
                .CountAsync(cancellationToken);

            if (total == 0)
            {
                return NotFound(new { Total = 0, Products = new List<ProductGetAllResponse>() });
            }

            // Kreiranje osnovne upite za dohvat proizvoda
            IQueryable<Product> query = _db.Products
                .Where(p => p.ProductType == productType)
                .Include(p => p.Photos);

            // Sortiranje prema odabranom kriteriju
            switch (sortBy.ToLower())
            {
                case "datecreatedoldest":
                    query = query.OrderBy(p => p.DateCreated);
                    break;
                case "price":
                    query = query.OrderBy(p => p.Price);
                    break;
                case "saleamount":
                    query = query.OrderBy(p => p.SaleAmount);
                    break;
                case "pricehighest":
                    query = query.OrderByDescending(p => p.Price);
                    break;
                case "datecreatednewest":
                    query = query.OrderByDescending(p => p.DateCreated);
                    break;
                case "salelowest":
                    query = query.OrderByDescending(p => p.SaleAmount);
                    break;
                case "discountedpricehighest":
                    query = query.OrderByDescending(p => p.SaleAmount > 0
                        ? (decimal)p.Price * (1 - p.SaleAmount)
                        : (decimal)p.Price);
                    break;
                case "discountedpricelowest":
                    query = query.OrderBy(p => p.SaleAmount > 0
                        ? (decimal)p.Price * (1 - p.SaleAmount)
                        : (decimal)p.Price);
                    break;
                case "title":
                default:
                    query = query.OrderBy(p => p.Title);
                    break;
            }

            // Dohvat proizvoda s paginacijom
            var products = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
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
                    PhotoPaths = p.Photos.Select(photo => photo.Path).ToList(),
                    DateCreated = p.DateCreated,
                    DiscountedPrice = p.SaleAmount > 0
                        ? (decimal)p.Price * (1 - p.SaleAmount)
                        : (decimal)p.Price,
                })
                .ToListAsync(cancellationToken);

            // Povrat rezultata
            return Ok(new
            {
                Total = total,
                Products = products
            });
        }
    }
}
