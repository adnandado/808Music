using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.ArtistEndpoints
{
    public class ArtistDeleteFlaggedEndpoint(ApplicationDbContext db, DeleteService ds, IConfiguration cfg) : MyEndpointBaseAsync.WithoutRequest.WithActionResult
    {
        [HttpDelete]
        public override async Task<ActionResult> HandleAsync(CancellationToken cancellationToken = default)
        {
            Request.Headers.TryGetValue("BackgroundScheduler", out StringValues headerValue);
            bool isFromOrigin = headerValue.ToString() == cfg["BackendUrl"];
            if(!isFromOrigin) {
                return Unauthorized();
            }

            var flaggedArtists = await db.Artists.Where(a => a.IsFlaggedForDeletion && a.DeletionDate <  DateTime.Now).ToListAsync();
            
            bool res = true;
            foreach (var artist in flaggedArtists)
            {
                res = await ds.DeleteArtistAsync(artist);
            }

            return res ? Ok() : BadRequest();
            
        }
    }
}
