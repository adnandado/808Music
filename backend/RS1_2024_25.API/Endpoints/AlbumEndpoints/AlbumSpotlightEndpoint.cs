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
    public class AlbumSpotlightEndpoint(ApplicationDbContext db, TokenProvider tp) : MyEndpointBaseAsync.WithRequest<SpotlightRequest>.WithActionResult<SpotlightResponse>
    {
        [Authorize]
        [HttpPost]
        public override async Task<ActionResult<SpotlightResponse>> HandleAsync(SpotlightRequest request, CancellationToken cancellationToken = default)
        {
            var jwt = tp.GetDecodedJwt(Request);
            bool isAdmin = jwt.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)!.Value == "Admin";
            int userId = int.Parse(tp.GetJwtSub(Request));

            var album = await db.Albums.Where(a => a.ReleaseDate < DateTime.Now && a.Id == request.AlbumId 
                                && db.Tracks.Where(t => t.AlbumId == request.AlbumId).Count() > 0).FirstOrDefaultAsync(cancellationToken);
            if(album == null)
            {
                return BadRequest("No valid album found...");
            }

            bool allowedToCreate = tp.AuthorizeUserArtist(Request, album.ArtistId, ["Owner", "General Manager", "Streaming Manager"]);

            if (!isAdmin && !allowedToCreate)
            {
                return Unauthorized();
            }

            var spotlight = await db.AlbumSpotlights.Where(a => a.ArtistId == album.ArtistId).FirstOrDefaultAsync(cancellationToken);
            if(spotlight == null)
            {
                spotlight = new ArtistAlbumSpotlight
                {
                    ArtistId = album.ArtistId,
                    AlbumId = album.Id,
                };
                await db.AlbumSpotlights.AddAsync(spotlight, cancellationToken);
            }
            else
            {
                spotlight.ArtistId = album.ArtistId;
                spotlight.AlbumId = album.Id;
            }

            await db.SaveChangesAsync(cancellationToken);

            return Ok(new SpotlightResponse
            {
                AlbumId = album.Id,
                IsHighlighted = true
            });

        }
    }

    public class SpotlightRequest
    {
        public int AlbumId { get; set; }
    }

    public class SpotlightResponse
    {
        public int AlbumId { get; set; }
        public bool IsHighlighted { get; set; }
    }
}
