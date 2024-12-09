using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace RS1_2024_25.API.Endpoints.AlbumEndpoints
{
    public class AlbumGetAllEndpoint(ApplicationDbContext db, TokenProvider tp) : MyEndpointBaseAsync.WithRequest<AlbumGetAllRequest>.WithActionResult<MyPagedList<AlbumGetResponse>>
    {
        [HttpGet]
        [Authorize]
        public override async Task<ActionResult<MyPagedList<AlbumGetResponse>>> HandleAsync([FromQuery] AlbumGetAllRequest request, CancellationToken cancellationToken = default)
        {
            var albums = db.Albums.AsQueryable();
            IQueryable<AlbumGetAllResponse> albumsResponse;

            //filters
            if(request.ArtistId != null)
            {
                albums = albums.Where(a => a.ArtistId == request.ArtistId);
            }

            if (request.TypeId != null)
            {
                albums = albums.Where(a => a.AlbumTypeId == request.TypeId);
            }

            if(request.IsReleased != null)
            {
                albums = albums.Where(a => (DateTime.UtcNow > a.ReleaseDate && (bool)request.IsReleased) || (DateTime.UtcNow < a.ReleaseDate && !(bool)request.IsReleased));
            }

            if(request.Title != string.Empty)
            {
                albums = albums.Where(a => a.Title.ToLower().Contains(request.Title.ToLower()));
            }

            await db.AlbumTypes.LoadAsync();

            albumsResponse = albums.Select(a => new AlbumGetAllResponse
            {
                Id = a.Id,
                Artist = a.Artist.Name,
                CoverArt = a.CoverPath != "" ? $"/media/Images/AlbumCovers/{a.CoverPath}" : "",
                ReleaseDate = a.ReleaseDate,
                Title = a.Title,
                Type = a.AlbumType.Type
            });

            var pagedList = await MyPagedList<AlbumGetAllResponse>.CreateAsync(albumsResponse, request, cancellationToken);
            return Ok(pagedList);
        }
    }

    public class AlbumGetAllRequest : MyPagingRequest
    {
        public int? ArtistId { get; set; }
        public int? TypeId { get; set; }
        public bool? IsReleased { get; set; }
        public string Title { get; set; } = string.Empty;
    }

    public class AlbumGetAllResponse {
        public int Id { get; set; }
        public string Title { get; set; }
        public string CoverArt {  get; set; }
        public DateTime ReleaseDate { get; set; }
        public string Artist { get; set; }
        public string Type { get; set; }
    }
}
