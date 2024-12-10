using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NAudio.Wave;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using RS1_2024_25.API.Services.Interfaces;
using System.Linq;
using System.Security.Claims;

namespace RS1_2024_25.API.Endpoints.TrackEndpoints
{
    public class TrackInsertOrUpdateEndpoint(ApplicationDbContext db, TokenProvider tp, IMyFileHandler fh, IConfiguration cfg) : MyEndpointBaseAsync.WithRequest<TrackInsertRequest>.WithActionResult<TrackInsertResponse>
    {
        [Authorize]
        [HttpPost]
        public override async Task<ActionResult<TrackInsertResponse>> HandleAsync([FromForm] TrackInsertRequest request, CancellationToken cancellationToken = default)
        {
            if(!request.HandleValidation())
            {
                return BadRequest("Invalid form data.");
            }

            Album? a = await db.Albums.FindAsync(request.AlbumId);
            if(a == null)
            {
                return BadRequest("Album not found");
            }

            bool isAdmin = tp.GetDecodedJwt(Request).Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)!.Value == "Admin";
            bool allowedToCreate = tp.AuthorizeUserArtist(Request, a.ArtistId, ["Owner", "General Manager", "Streaming Manager"]);

            if(!isAdmin && !allowedToCreate)
            {
                return Unauthorized();
            }

            Track t;

            if(request.Id != null)
            {
                t = (await db.Tracks.FindAsync(request.Id))!;
                if(request.TrackFile != null)
                {
                    fh.DeleteFile(cfg["StaticFilePaths:Tracks"] + t.TrackPath);
                    t.TrackPath = "";
                }
            }
            else
            {
                t = new Track();
                await db.Tracks.AddAsync(t);
            }

            string trackName = t.TrackPath;

            if (request.TrackFile != null)
            {
                trackName = await fh.UploadFile(cfg["StaticFilePaths:Tracks"]!, request.TrackFile, 0, cancellationToken);
                if(trackName == string.Empty)
                {
                    return BadRequest("Invalid track file!");
                }
            }

            WaveStream file = new MediaFoundationReader(cfg["StaticFilePaths:Tracks"] + trackName);


            t.Title = request.Title;
            t.TrackPath = trackName;
            t.isExplicit = request.IsExplicit;
            t.Length = (int)file.TotalTime.TotalSeconds;
            t.AlbumId = a.Id;

            await db.SaveChangesAsync();

            ArtistTrack? at = await db.ArtistsTracks.FirstOrDefaultAsync(atracks => atracks.IsLead && atracks.TrackId == t.Id && atracks.ArtistId == a.ArtistId);
            if (at == null)
            {
                at = new ArtistTrack()
                {
                    ArtistId = a.ArtistId,
                    IsLead = true,
                    TrackId = t.Id,
                    ShowOnProfile = false,   
                };           
                await db.ArtistsTracks.AddAsync(at);
            }

            List<int> currentArtists = await db.ArtistsTracks.Where(atracks => !atracks.IsLead && atracks.TrackId == t.Id).Select(atracks => atracks.ArtistId).ToListAsync();

            foreach(int artistId in currentArtists)
            {
                if (!request.ArtistIds.Contains(artistId))
                {
                    ArtistTrack? removeArtist = await db.ArtistsTracks.FirstOrDefaultAsync(atracks => !atracks.IsLead && atracks.TrackId == t.Id && atracks.ArtistId == artistId);
                    if (removeArtist != null)
                    {
                        db.ArtistsTracks.Remove(removeArtist);
                    }
                }
            }
            
            foreach (int artistId in request.ArtistIds)
            {
                ArtistTrack? featuredArtist = await db.ArtistsTracks.FirstOrDefaultAsync(atracks => !atracks.IsLead && atracks.TrackId == t.Id && atracks.ArtistId == artistId);
                if (featuredArtist == null)
                {
                    featuredArtist = new ArtistTrack()
                    {
                        ArtistId = artistId,
                        IsLead = false,
                        TrackId = t.Id,
                        ShowOnProfile = true,
                    };
                    await db.ArtistsTracks.AddAsync(featuredArtist);
                }
            };

            await db.SaveChangesAsync();

            return Ok(new TrackInsertResponse
            {
                Id = t.Id,
                Title = t.Title,
                MainArtist = db.Artists.FirstOrDefault(ar => ar.Id == a.ArtistId)!.Name
            });
        }
    }

    public class TrackInsertRequest : IValidatable
    {
        public int? Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public IFormFile? TrackFile { get; set; }
        public bool IsExplicit { get; set; }
        public int AlbumId { get; set; }
        public List<int> ArtistIds { get; set; } = new List<int> ();

        public bool HandleValidation()
        {
            if(Id == null && TrackFile == null)
            { 
                return false; 
            }
            return true;
        }
    }

    public class TrackInsertResponse
    {
        public int? Id { get; set; }
        public string Title { get; set; }
        public string MainArtist {  get; set; }

    }
}
