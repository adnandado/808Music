using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.ArtistEndpoints
{
    public class ArtistFlagForDeletionEndpoint(ApplicationDbContext db, TokenProvider tp, DeleteService ds) : MyEndpointBaseAsync.WithRequest<int>.WithActionResult
    {
        [Authorize]
        [HttpDelete("{id}")]
        public override async Task<ActionResult> HandleAsync(int id, CancellationToken cancellationToken = default)
        {
            int userId = int.Parse(tp.GetJwtSub(Request));

            UserArtist? uaCheck = await db.UserArtists.FirstOrDefaultAsync(a => a.MyAppUserId == userId && a.ArtistId == id && a.IsUserOwner);

            if (uaCheck == null)
            {
                return Unauthorized();
            }

            Artist? a = await db.Artists.FindAsync(id);
            if (a == null)
            {
                return NotFound();
            }

            if(a.IsFlaggedForDeletion)
            {
                a.IsFlaggedForDeletion = false;
            }
            else
            {
                a.IsFlaggedForDeletion = true;
                a.DeletionDate = DateTime.Now.AddDays(7);
            }

            await db.SaveChangesAsync(cancellationToken);

            return Ok(a.IsFlaggedForDeletion ? $"Artist profile and all of its catalogue will be deleted on {DateTime.Now.AddHours(1).ToShortDateString()}" 
                : "Artist profile planned deletion cancelled.");

            //bool res = await ds.DeleteArtistAsync(a);

            //return res ? Ok() : BadRequest();
        }
    }
}
