using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.ArtistEndpoints
{
    public class DeleteArtistEndpoint(ApplicationDbContext db, TokenProvider tp) : MyEndpointBaseAsync.WithRequest<int>.WithoutResult
    {
        [Authorize]
        [HttpDelete("{id}")]
        public override async Task HandleAsync(int id, CancellationToken cancellationToken = default)
        {
            int userId = int.Parse(tp.GetJwtSub(Request));

            UserArtist? uaCheck = await db.UserArtists.FirstOrDefaultAsync(a => a.MyAppUserId == userId && a.ArtistId == id && a.IsUserOwner);

            if (uaCheck == null)
            {
                throw new KeyNotFoundException("User or artist not found");
            }

            var userArtistsToDelete = await db.UserArtists.Where(ua => ua.ArtistId == id).ToListAsync();

        }
    }
}
