using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using System.IdentityModel.Tokens.Jwt;

namespace RS1_2024_25.API.Endpoints.TemporaryEndpoints
{
    public class GetArtistsEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync.WithoutRequest.WithActionResult<List<ArtistResponse>>
    {
        [HttpGet]
        public override async Task<ActionResult<List<ArtistResponse>>> HandleAsync(CancellationToken cancellationToken = default)
        {
            /*
            string token = Request.Headers.Authorization.ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var decodedToken = handler.ReadJwtToken(token);
            string id = decodedToken.Claims.FirstOrDefault(x => x.Type == "Username")?.Value;
            */

            return await db.Artists.Select(
                a => new ArtistResponse { Id = a.Id, Name = a.Name})
                .ToListAsync();
        }
    }
    public class ArtistResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
