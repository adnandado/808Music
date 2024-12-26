using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using static ProductGetByIdEndpoint;

public class ProductGetByIdEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
    .WithRequest<string>
    .WithResult<ProductGetByIdResponse>
{
    [HttpGet("{slug}")]
    public override async Task<ProductGetByIdResponse> HandleAsync(string slug, CancellationToken cancellationToken = default)
    {
        var product = await db.Products
                            .Where(p => p.Slug == slug)
                            .Include(p => p.Photos)
                            .Include(p => p.Artist) 
                            .Select(p => new ProductGetByIdResponse
                            {
                                ID = p.Id,
                                Title = p.Title,
                                Price = p.Price,
                                Quantity = p.QtyInStock,
                                isDigital = p.IsDigital,
                                Slug = p.Slug,
                                PhotoPaths = p.Photos.Select(photo => photo.Path).ToList(),
                                ArtistName = p.Artist.Name,  
                                ArtistPhoto = p.Artist.ProfilePhotoPath 
                            })
                            .FirstOrDefaultAsync(x => x.Slug == slug, cancellationToken);

        if (product == null)
            throw new KeyNotFoundException("Product not found");

        return product;
    }

    public class ProductGetByIdResponse
    {
        public required int ID { get; set; }
        public required string Title { get; set; }
        public required float Price { get; set; }
        public int Quantity { get; set; }
        public bool isDigital { get; set; }
        public string Slug { get; set; }
        public List<string> PhotoPaths { get; set; } = new();
        public string ArtistName { get; set; } 
        public string ArtistPhoto { get; set; }
    }
}
