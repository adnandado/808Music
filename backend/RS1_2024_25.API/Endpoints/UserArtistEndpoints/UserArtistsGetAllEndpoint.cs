using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.UserArtistEndpoints
{
    public class UserArtistsGetAllEndpoint(ApplicationDbContext db, TokenProvider tp) : MyEndpointBaseAsync.WithRequest<int>.WithActionResult<List<UserArtistGetAllResponse>>
    {
        [Authorize]
        [HttpGet("{id}")]
        public override async Task<ActionResult<List<UserArtistGetAllResponse>>> HandleAsync(int id, CancellationToken cancellationToken = default)
        {
            int userId = int.Parse(tp.GetJwtSub(Request));

            UserArtist? checkOwner = await db.UserArtists.FirstOrDefaultAsync(ua => ua.IsUserOwner && ua.MyAppUserId == userId && ua.ArtistId == id, cancellationToken);
            if(checkOwner == null)
            {
                return BadRequest("Artist not found");
            }

            return Ok(await db.UserArtists.Where(ua => ua.ArtistId == id).Select(ua => new UserArtistGetAllResponse
            {
                Id = ua.MyAppUserId,
                Username = ua.User!.Username,
                Role = ua.Role!
            }).ToListAsync());
        }
    }

    public class UserArtistGetAllResponse
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public UserArtistRole Role { get; set; }
    }
}
