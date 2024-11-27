using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper;
using RS1_2024_25.API.Helper.Api;

namespace RS1_2024_25.API.Endpoints.AlbumEndpoints
{
    public class AlbumGetAllEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync.WithRequest<AlbumGetAllRequest>.WithActionResult<MyPagedList<AlbumGetResponse>>
    {
        [HttpGet]
        [Authorize]
        public override async Task<ActionResult<MyPagedList<AlbumGetResponse>>> HandleAsync([FromQuery] AlbumGetAllRequest request, CancellationToken cancellationToken = default)
        {
            var albums = db.Albums.AsQueryable();

            //filters go here once needed

            var albumsResponse = albums.Select(a => new AlbumGetAllResponse
            {
                Id = a.Id,
                Artist = a.Artist.Name,
                CoverArt = a.CoverPath != "" ? $"/media/Images/AlbumCovers/{a.CoverPath}" : "",
                ReleaseDate = a.ReleaseDate,
                Title = a.Title
            });

            var pagedList = await MyPagedList<AlbumGetAllResponse>.CreateAsync(albumsResponse, request, cancellationToken);
            return Ok(albumsResponse);
        }
    }

    public class AlbumGetAllRequest : MyPagingRequest
    {

    }

    public class AlbumGetAllResponse {
        public int Id { get; set; }
        public string Title { get; set; }
        public string CoverArt {  get; set; }
        public DateTime ReleaseDate { get; set; }
        public string Artist { get; set; }
    }
}
