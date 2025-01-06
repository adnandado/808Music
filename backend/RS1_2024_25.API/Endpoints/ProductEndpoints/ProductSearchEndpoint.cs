using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using static RS1_2024_25.API.Endpoints.CityEndpoints.ProductGetAllEndpoint;

namespace RS1_2024_25.API.Endpoints.ProductEndpoints
{
    [ApiController]
    [Route("api/products")]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public ProductsController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchProducts(
     [FromQuery] string keyword,
     [FromQuery] string sortBy = "title",
     [FromQuery] int page = 1,
     [FromQuery] int pageSize = 10,
     CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(keyword))
            {
                return BadRequest("Keyword is required.");
            }

            var total = await _db.Products
                .Where(p => EF.Functions.Like(p.Title.ToLower(), $"%{keyword.ToLower()}%"))
                .CountAsync(cancellationToken);

            if (total == 0)
            {
                return NotFound(new { Total = 0, Products = new List<ProductGetAllResponse>() });
            }

            IQueryable<Product> query = _db.Products
                .Where(p => EF.Functions.Like(p.Title.ToLower(), $"%{keyword.ToLower()}%"))
                .Include(p => p.Photos);

            
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

            return Ok(new
            {
                Total = total,
                Products = products
            });
        }


    }
}
