using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;

namespace RS1_2024_25.API.Endpoints.AlbumEndpoints
{
    public class AlbumTypeGetAllEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync.WithoutRequest.WithActionResult<List<AlbumType>>
    {
        [HttpGet]
        public override async Task<ActionResult<List<AlbumType>>> HandleAsync(CancellationToken cancellationToken = default)
        {
            List<AlbumType> types = await db.AlbumTypes.ToListAsync();
            return Ok(types);
        }
    }
}
