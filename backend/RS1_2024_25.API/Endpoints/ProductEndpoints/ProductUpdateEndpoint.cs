using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using static RS1_2024_25.API.Endpoints.CityEndpoints.ProductUpdateEndpoint;

namespace RS1_2024_25.API.Endpoints.CityEndpoints
{
    public class ProductUpdateEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
        .WithRequest<ProductUpdateRequest>
        .WithResult<ProductUpdateResponse>
    {
        [HttpPut]
        public override async Task<ProductUpdateResponse> HandleAsync([FromBody] ProductUpdateRequest request, CancellationToken cancellationToken = default)
        {
            var product = await db.Products.FindAsync([request.ID], cancellationToken);//ili SingleOrDefault

            if (product == null)
                throw new KeyNotFoundException("Product not found");

            product.Title = request.Title;
            product.Price = request.Price;
            product.QtyInStock = request.Quantity;
            product.IsDigital = request.isDigital;


            await db.SaveChangesAsync(cancellationToken);

            return new ProductUpdateResponse
            {
                ID = product.Id,
                Title = product.Title,
                Quantity = product.QtyInStock,
                isDigital = product.IsDigital,
                Price = product.Price
            };
        }

        public class ProductUpdateRequest
        {
            public required int ID { get; set; }
            public required string Title { get; set; }
            public required float Price { get; set; }
            public int Quantity { get; set; }
            public bool isDigital { get; set; }
        }

        public class ProductUpdateResponse
        {
            public required int ID { get; set; }
            public required string Title { get; set; }
            public required float Price { get; set; }
            public int Quantity { get; set; }
            public bool isDigital { get; set; }
        }
    }
}
