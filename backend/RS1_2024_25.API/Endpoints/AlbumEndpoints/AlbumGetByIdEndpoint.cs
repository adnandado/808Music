using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;

namespace RS1_2024_25.API.Endpoints.AlbumEndpoints
{
    public class AlbumGetByIdEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync.WithRequest<int>.WithActionResult<AlbumGetResponse>
    {
        [HttpGet("{id}")]
        public override async Task<ActionResult<AlbumGetResponse>> HandleAsync(int id, CancellationToken cancellationToken = default)
        {
            Album a = await db.Albums.FindAsync(id, cancellationToken);

            if(a == null)
                return NotFound();

            var response = new AlbumGetResponse
            {
                Id = a.Id,
                Artist = await db.Artists.FindAsync(a.ArtistId,cancellationToken),
                CoverPath = a.CoverPath != "" ? $"/media/Images/AlbumCovers/{a.CoverPath}" : "",
                Distributor = a.Distributor,
                NumOfTracks = a.NumOfTracks,
                ReleaseDate = a.ReleaseDate,
                Title = a.Title,
                Type = await db.AlbumTypes.FindAsync(a.AlbumTypeId,cancellationToken),
                IsActive = a.IsActive
            };

            return Ok(response);
        }
    }

    public class AlbumGetResponse
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Distributor { get; set; } = string.Empty;
        public DateTime ReleaseDate { get; set; }
        public AlbumType Type { get; set; }
        public string CoverPath { get; set; }
        public int NumOfTracks { get; set; }
        public Artist Artist { get; set; }
        public bool IsActive { get; set; }
    }
}
