using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using System.Security.Claims;

namespace RS1_2024_25.API.Endpoints.AlbumEndpoints
{
    public class AlbumDeleteEndpoint(ApplicationDbContext db, TokenProvider tp) : MyEndpointBaseAsync.WithRequest<int>.WithoutResult
    {
        [Authorize]
        [HttpDelete("{id}")]
        public override async Task HandleAsync(int id, CancellationToken cancellationToken = default)
        {
            Album a = await db.Albums.FindAsync(id);

            if (a == null)
            {
                throw new KeyNotFoundException("Album not found");
            }

            var jwt = tp.GetDecodedJwt(Request);
            bool isAdmin = jwt.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)!.Value == "Admin";
            if (isAdmin)
            {
                db.Albums.Remove(a);
            }
            else
            {
                int userId = int.Parse(jwt.Subject);
                UserArtist? uaCheck = await db.UserArtists.FirstOrDefaultAsync(ua => ua.MyAppUserId == userId && ua.ArtistId == a.ArtistId && ua.IsUserOwner);
                if (uaCheck == null)
                {                   
                    throw new KeyNotFoundException("Artist not found");
                }
                db.Albums.Remove(a);
            }

            await db.SaveChangesAsync();
        }
    }
}
