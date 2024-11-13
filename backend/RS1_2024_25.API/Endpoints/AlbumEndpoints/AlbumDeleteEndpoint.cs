using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;

namespace RS1_2024_25.API.Endpoints.AlbumEndpoints
{
    public class AlbumDeleteEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync.WithRequest<int>.WithoutResult
    {
        [HttpDelete("{id}")]
        public override async Task HandleAsync(int id, CancellationToken cancellationToken = default)
        {
            Album a = await db.Albums.FindAsync(id);

            if (a == null)
            {
                throw new KeyNotFoundException("Album not found");
            }

            db.Albums.Remove(a);
            await db.SaveChangesAsync();
        }
    }
}
