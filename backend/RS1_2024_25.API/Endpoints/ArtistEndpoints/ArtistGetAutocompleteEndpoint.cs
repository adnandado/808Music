using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Endpoints.UserEndpoints;
using RS1_2024_25.API.Helper.Api;

namespace RS1_2024_25.API.Endpoints.ArtistEndpoints
{
    public class ArtistGetAutocompleteEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync.WithRequest<UserArtistSearchRequest>.WithActionResult<List<ArtistResponse>>
    {
        [Authorize]
        [HttpGet]
        public override async Task<ActionResult<List<ArtistResponse>>> HandleAsync([FromQuery] UserArtistSearchRequest queryString, CancellationToken cancellationToken = default)
        {
            var artists = db.Artists.AsQueryable();
            if (queryString.LeadTrackId != null)
            {
                int? leadArtistId = await db.ArtistsTracks.Where(at => at.IsLead && queryString.LeadTrackId == at.TrackId).Select(at => at.ArtistId).FirstOrDefaultAsync(cancellationToken);
                if(leadArtistId == null)
                {
                    return BadRequest("This artist is not the main artist for the provided song");
                }
                artists = artists.Where(a => a.Id != leadArtistId);
            }

            if (queryString.SearchString != string.Empty)
            {
                return Ok(await artists.Where(a => a.Name.ToLower().Contains(queryString.SearchString.ToLower())).Take(5).Select(a => new ArtistResponse
                {
                    Id = a.Id,
                    Name = a.Name,
                    DeletionDate = DateTime.Now.ToString(),
                    IsFlaggedForDeletion = false,
                    Role = "",
                    PfpPath = "/media/Images/ArtistPfps/"+ a.ProfilePhotoPath
                }).ToListAsync());
            }
            else
            {
                return Ok(await artists.AsQueryable().Take(5).Select(a => new ArtistResponse
                {
                    Id = a.Id,
                    Name = a.Name,
                    DeletionDate = DateTime.Now.ToString(),
                    IsFlaggedForDeletion = false,
                    Role = "",
                    PfpPath = "/media/Images/ArtistPfps/" + a.ProfilePhotoPath
                }).ToListAsync());
            }
        }
    }

    public class UserArtistSearchRequest
    {
        public string SearchString { get; set; } = string.Empty;
        public int? LeadTrackId { get; set; }
    }
}
