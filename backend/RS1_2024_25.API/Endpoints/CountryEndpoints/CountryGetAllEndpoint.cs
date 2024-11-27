using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;

namespace RS1_2024_25.API.Endpoints.CountryEndpoints
{
    public class CountryGetAllEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync.WithoutRequest.WithActionResult<Country[]>
    {
        [HttpGet]
        public override async Task<ActionResult<Country[]>> HandleAsync(CancellationToken cancellationToken = default)
        {
            return await db.Countries.ToArrayAsync(cancellationToken);
        }
    }
}
