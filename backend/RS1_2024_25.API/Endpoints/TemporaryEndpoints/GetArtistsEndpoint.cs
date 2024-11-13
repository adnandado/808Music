using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;

namespace RS1_2024_25.API.Endpoints.TemporaryEndpoints
{
    public class GetArtistsEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync.WithoutRequest.WithActionResult<List<ArtistResponse>>
    {
        [HttpGet]
        public override async Task<ActionResult<List<ArtistResponse>>> HandleAsync(CancellationToken cancellationToken = default)
        {
            return await db.Artists.Select(
                a => new ArtistResponse { Id = a.Id, Name = a.Name })
                .ToListAsync();
        }
    }
    public class ArtistResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
