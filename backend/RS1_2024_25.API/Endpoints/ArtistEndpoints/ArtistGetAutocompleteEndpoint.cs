using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Utilities.IO;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Endpoints.UserEndpoints;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services.Interfaces;

namespace RS1_2024_25.API.Endpoints.ArtistEndpoints
{
    public class ArtistGetAutocompleteEndpoint(ApplicationDbContext db, IMyCacheService cs) : MyEndpointBaseAsync.WithRequest<UserArtistSearchRequest>.WithActionResult<List<ArtistResponse>>
    {
        [Authorize]
        [HttpGet]
        public override async Task<ActionResult<List<ArtistResponse>>> HandleAsync([FromQuery] UserArtistSearchRequest queryString, CancellationToken cancellationToken = default)
        {
            var query = await cs.GetAsync<List<Artist>>("artists", async () =>
            {
                List<Artist> aList = await db.Artists.ToListAsync();
                return aList;
            }, cancellationToken);

            var artists = query.AsQueryable();
            if (queryString.LeadTrackId != null)
            {
                int? leadArtistId = await db.ArtistsTracks.Where(at => at.IsLead && queryString.LeadTrackId == at.TrackId).Select(at => at.ArtistId).FirstOrDefaultAsync(cancellationToken);
                if(leadArtistId == null)
                {
                    return BadRequest("This artist is not the main artist for the provided song");
                }
                artists = artists.Where(a => a.Id != leadArtistId);
            }

            if(queryString.NeedsToHaveSongs)
            {
                await db.Tracks.LoadAsync();
                await db.Albums.LoadAsync();

                artists = artists.Where(a => db.ArtistsTracks.Where(at => at.ArtistId == a.Id && at.Track.Album.ReleaseDate < DateTime.Now).Count() > 0);
            }

            if (queryString.SortByPopularity)
            {
                artists = artists.OrderByDescending(a => a.Followers);
            }

            if(queryString.SortByStreams)
            {
                await db.Tracks.LoadAsync();

                artists = artists.OrderByDescending(a => db.ArtistsTracks.Where(at => a.Id == at.ArtistId).Select(at => at.Track.Streams).Sum());
            }

            if (queryString.SearchString != string.Empty)
            {
                return Ok(artists.Where(a => a.Name.ToLower().Contains(queryString.SearchString.ToLower())).Take(queryString.ReturnAmount).Select(a => new ArtistResponse
                {
                    Id = a.Id,
                    Name = a.Name,
                    DeletionDate = DateTime.Now.ToString(),
                    IsFlaggedForDeletion = false,
                    Role = "",
                    PfpPath = "/media/Images/ArtistPfps/" + a.ProfilePhotoPath,
                    Followers = a.Followers,
                    Streams = db.ArtistsTracks.Where(at => a.Id == at.ArtistId).Select(at => at.Track == null ? 0 : at.Track.Streams).Sum()
                }).ToList());
            }
            else
            {
                return Ok(artists.AsQueryable().Take(queryString.ReturnAmount).Select(a => new ArtistResponse
                {
                    Id = a.Id,
                    Name = a.Name,
                    DeletionDate = DateTime.Now.ToString(),
                    IsFlaggedForDeletion = false,
                    Role = "",
                    PfpPath = "/media/Images/ArtistPfps/" + a.ProfilePhotoPath,
                    Followers = a.Followers,
                    Streams = db.ArtistsTracks.Where(at => a.Id == at.ArtistId).Select(at => at.Track == null ? 0 : at.Track.Streams).Sum()
                }).ToList());
            }
        }
    }

    public class UserArtistSearchRequest
    {
        public string SearchString { get; set; } = string.Empty;
        public int? LeadTrackId { get; set; }
        public int ReturnAmount { get; set; } = 5;
        public bool SortByPopularity { get; set; } = false;
        public bool NeedsToHaveSongs { get; set; } = false;
        public bool SortByStreams { get; set; } = false;
    }
}
