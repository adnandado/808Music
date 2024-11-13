namespace RS1_2024_25.API.Endpoints.CityEndpoints;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using System.Threading;
using System.Threading.Tasks;

//[MyAuthorization(isAdmin: true, isManager: false)]
public class ProductDeleteEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
    .WithRequest<int>
    .WithoutResult
{

    [HttpDelete("{id}")]
    public override async Task HandleAsync(int id, CancellationToken cancellationToken = default)
    {
        var product = await db.Products.SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (product == null)
            throw new KeyNotFoundException("Product not found");

        db.Products.Remove(product);
        await db.SaveChangesAsync(cancellationToken);
    }
}

