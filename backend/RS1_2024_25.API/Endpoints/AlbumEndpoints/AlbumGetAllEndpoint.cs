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

            //var jwt = tp.GetDecodedJwt(Request);
            //bool isAdmin = jwt.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)!.Value == "Admin";


            //filters
            if(request.ArtistId != null)
            {
                albums = albums.Where(a => a.ArtistId == request.ArtistId);
            }

            albumsResponse = albums.Select(a => new AlbumGetAllResponse
            {
                Id = a.Id,
                Artist = a.Artist.Name,
                CoverArt = a.CoverPath != "" ? $"/media/Images/AlbumCovers/{a.CoverPath}" : "",
                ReleaseDate = a.ReleaseDate,
                Title = a.Title
            });

            /*
            if (isAdmin)
            {
                albumsResponse = albums.Select(a => new AlbumGetAllResponse
                {
                    Id = a.Id,
                    Artist = a.Artist.Name,
                    CoverArt = a.CoverPath != "" ? $"/media/Images/AlbumCovers/{a.CoverPath}" : "",
                    ReleaseDate = a.ReleaseDate,
                    Title = a.Title
                });
            }
            else
            {
                int userId = int.Parse(jwt.Subject);
                UserArtist? uaCheck = await db.UserArtists.FirstOrDefaultAsync(ua => ua.MyAppUserId == userId && ua.ArtistId == request.ArtistId);
                if(uaCheck == null)
                {
                    return Unauthorized("Artist not found");
                }
                albumsResponse = albums.Where(a => a.ArtistId == request.ArtistId).Select(a => new AlbumGetAllResponse
                {
                    Id = a.Id,
                    Artist = a.Artist.Name,
                    CoverArt = a.CoverPath != "" ? $"/media/Images/AlbumCovers/{a.CoverPath}" : "",
                    ReleaseDate = a.ReleaseDate,
                    Title = a.Title
                });
            }
            */

            var pagedList = await MyPagedList<AlbumGetAllResponse>.CreateAsync(albumsResponse, request, cancellationToken);
            return Ok(albumsResponse);
        }
    }

    public class AlbumGetAllRequest : MyPagingRequest
    {
        public int? ArtistId { get; set; }
    }

    public class AlbumGetAllResponse {
        public int Id { get; set; }
        public string Title { get; set; }
        public string CoverArt {  get; set; }
        public DateTime ReleaseDate { get; set; }
        public string Artist { get; set; }
    }
}
