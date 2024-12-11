using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using System.Collections.Immutable;
using System.Linq;

namespace RS1_2024_25.API.Endpoints.UserArtistEndpoints
{
    public class RolesGetAllEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync.WithoutRequest.WithActionResult<List<UserArtistRole>>
    {
        [HttpGet]
        public override async Task<ActionResult<List<UserArtistRole>>> HandleAsync(CancellationToken cancellationToken = default)
        {
            return await db.UserArtistRoles.Where(r => r.RoleName != "Owner").ToListAsync();
        }
    }
}
