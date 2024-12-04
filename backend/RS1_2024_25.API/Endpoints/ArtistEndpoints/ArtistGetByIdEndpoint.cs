using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.ArtistEndpoints
{
    public class ArtistGetByIdEndpoint(ApplicationDbContext db, TokenProvider tp) : MyEndpointBaseAsync.WithRequest<int>.WithActionResult<ArtistDetailResponse>
    {
        [Authorize]
        [HttpGet("{id}")]
        public override async Task<ActionResult<ArtistDetailResponse>> HandleAsync(int id, CancellationToken cancellationToken = default)
        {
            int userId = int.Parse(tp.GetJwtSub(Request));

            ArtistDetailResponse? response = await db.UserArtists.Where(ua => ua.ArtistId == id && ua.MyAppUserId == userId).Select(a => new ArtistDetailResponse
            {
                Id = id,
                Bio = a.Artist.Bio,
                Name = a.Artist.Name,
                ProfileBackgroundPath = $"/media/Images/ArtistBgs/{a.Artist.ProfileBackgroundPath}",
                ProfilePhotoPath = $"/media/Images/ArtistPfps/{a.Artist.ProfilePhotoPath}",
            }).FirstOrDefaultAsync(cancellationToken);

            if(response == null)
            {
                return BadRequest("Artist not found");
            }

            return response;
        }
    }

    public class ArtistDetailResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
        public string ProfilePhotoPath { get; set; } = string.Empty;
        public string ProfileBackgroundPath { get; set; } = string.Empty;
    }
}
