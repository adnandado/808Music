using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using static RS1_2024_25.API.Endpoints.AlbumEndpoints.AlbumToggleVisibilityEnpoint;

namespace RS1_2024_25.API.Endpoints.AlbumEndpoints
{
    public class AlbumToggleVisibilityEnpoint(ApplicationDbContext db) : MyEndpointBaseAsync.WithRequest<AlbumVisibilityRequest>.WithActionResult
    {
        [Authorize]
        [HttpGet]
        public override async Task<ActionResult> HandleAsync([FromQuery] AlbumVisibilityRequest request, CancellationToken cancellationToken = default)
        {
            Album a = await db.Albums.FindAsync(request.Id);
            if(a == null)
            {
                return BadRequest("Album not found");
            }
            if (a.ReleaseDate > DateTime.UtcNow)
            {
                return BadRequest("Album isn't released");
            }
            a.IsActive = request.IsActive;
            await db.SaveChangesAsync();
            return Ok();
        }

        public class AlbumVisibilityRequest
        {
            public int Id { get; set; }
            public bool IsActive { get; set; }
        }
    }
}
