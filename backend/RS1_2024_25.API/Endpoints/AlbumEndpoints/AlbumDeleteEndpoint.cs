using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using System.Security.Claims;

namespace RS1_2024_25.API.Endpoints.AlbumEndpoints
{
    public class AlbumDeleteEndpoint(ApplicationDbContext db, TokenProvider tp, FileHandler fh, IConfiguration cfg) : MyEndpointBaseAsync.WithRequest<int>.WithActionResult
    {
        [Authorize]
        [HttpDelete("{id}")]
        public override async Task<ActionResult> HandleAsync(int id, CancellationToken cancellationToken = default)
        {
            Album? a = await db.Albums.FindAsync(id);

            if (a == null)
            {
                return BadRequest("Album not found");
            }

            bool isAdmin = tp.GetJwtRoleClaimValue(Request) == "Admin";
            bool allowedToDelete = tp.AuthorizeUserArtist(Request, a.ArtistId, ["Owner"]);
            if (!isAdmin && !allowedToDelete)
            {
                return Unauthorized();
            }

            HttpResponseMessage? response = null;
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("Authorization", Request.Headers.Authorization.ToString());
                var tracks = await db.Tracks.Where(t => t.AlbumId == id).ToListAsync();
                foreach (Track track in tracks)
                {
                    response = await client.DeleteAsync(cfg["backendUrl"] + "api/TrackDeleteEndpoint/" + track.Id, cancellationToken);  
                }
            }

            fh.DeleteFile(cfg["StaticFilePaths:AlbumCovers"] + a.CoverPath);
            db.Albums.Remove(a);                


            await db.SaveChangesAsync();
            return Ok();
        }
    }
}
