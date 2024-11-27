using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace RS1_2024_25.API.Endpoints.AlbumEndpoints
{
    public class AlbumInsertOrUpdateEndpoint(ApplicationDbContext db, FileHandler fh) : MyEndpointBaseAsync.WithRequest<AlbumInsertRequest>.WithActionResult<AlbumInsertResponse>
    {
        [HttpPost]
        public override async Task<ActionResult<AlbumInsertResponse>> HandleAsync([FromForm]AlbumInsertRequest request, CancellationToken cancellationToken = default)
        {
            if(!request.HandleValidation())
            {
                return BadRequest("Data not valid");
            }

            Album a;
            if(request.Id != null)
            {
                a = await db.Albums.FindAsync(request.Id, cancellationToken);
            }
            else
            {
                a = new Album();
                await db.Albums.AddAsync(a);
            }

            a.Title = request.Title;
            a.Distributor = request.Distributor;
            a.ReleaseDate = request.ReleaseDate;
            a.AlbumTypeId = request.AlbumTypeId;
            a.IsActive = request.IsActive;
            a.ArtistId = request.ArtistId;

            if(request.CoverImage != null)
            {
                var path = await fh.UploadFile(@"wwwroot\Images\AlbumCovers", request.CoverImage, 0, cancellationToken);
                if (path == string.Empty)
                {
                    return BadRequest("Issue with file...");
                }
                a.CoverPath = path;
            }

            await db.SaveChangesAsync();
            var response = new AlbumInsertResponse
            {
                Title = a.Title,
                IsActive = a.IsActive,
                ReleaseDate = a.ReleaseDate,
                ByArtist = (await db.Artists.FindAsync(a.ArtistId, cancellationToken))?.Name ?? "Unknown"
            };

            return Ok(response);
        }
    }

    public class AlbumInsertRequest : IValidatable
    {
        public int? Id { get; set; }
        public string Title { get; set; }
        public string Distributor { get; set; } = string.Empty;
        public DateTime ReleaseDate { get; set; }
        public int AlbumTypeId { get; set; } = 4;
        public bool IsActive { get; set; } = false;
        public IFormFile? CoverImage { get; set; }
        public int ArtistId { get; set; }

        public bool HandleValidation()
        {
            return true;
        }
    }

    public class AlbumInsertResponse
    {
        public string Title { get; set; }
        public bool IsActive { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string ByArtist { get; set; }
    }
}
