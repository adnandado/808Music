using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using static RS1_2024_25.API.Endpoints.AlbumEndpoints.AlbumToggleVisibilityEndpoint;

namespace RS1_2024_25.API.Endpoints.AlbumEndpoints
{
    public class AlbumToggleVisibilityEndpoint(ApplicationDbContext db, IConfiguration cfg) : MyEndpointBaseAsync.WithoutRequest.WithActionResult
    {
        [HttpGet]
        public override async Task<ActionResult> HandleAsync(CancellationToken cancellationToken = default)
        {
            Request.Headers.TryGetValue("BackgroundScheduler", out StringValues headerValue);
            bool isFromOrigin = headerValue.ToString() == cfg["BackendUrl"];
            if (!isFromOrigin)
            {
                return Unauthorized();
            }

            List<Album> unreleasedAlbums = await db.Albums.Where(a => !a.IsActive).ToListAsync();
            foreach (var album in unreleasedAlbums) 
            {
                if (album.ReleaseDate < DateTime.Now)
                {
                    album.IsActive = true;
                    //Add notification to db
                    Notification notification = new Notification
                    {
                        ArtistId = album.ArtistId,
                        ContentId = album.Id,
                        CreatedAt = DateTime.Now,
                        Sent = false,
                        Type = nameof(Album),
                    };

                    await db.Notifications.AddAsync(notification, cancellationToken);
                }
            }
            await db.SaveChangesAsync(cancellationToken);
            return Ok();
        }
    }
}
