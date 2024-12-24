using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper;
using RS1_2024_25.API.Helper.Api;

namespace RS1_2024_25.API.Endpoints.TrackEndpoints
{
    public class TrackGetAllEndpoint(ApplicationDbContext db, IConfiguration cfg) : MyEndpointBaseAsync
        .WithRequest<TrackGetAllRequest>
        .WithActionResult<MyPagedList<TrackGetResponse>>
    {
        [Authorize]
        [HttpGet]
        public override async Task<ActionResult<MyPagedList<TrackGetResponse>>> HandleAsync([FromQuery]TrackGetAllRequest request, CancellationToken cancellationToken = default)
        {
            var tracks = db.Tracks.AsQueryable();
            await db.Artists.LoadAsync();

            if (request.FeaturedArtists != null)
            {
                foreach(int artistId in request.FeaturedArtists)
                {
                    tracks = db.ArtistsTracks.Where(db => db.ArtistId == artistId).Select(at => at.Track)!;
                }
            }

            if(request.AlbumId != null)
            {
                tracks = tracks.Where(t => t.AlbumId == request.AlbumId);
            }

            if(request.LeadArtistId != null)
            {
                await db.Albums.LoadAsync();
                tracks = tracks.Where(t => t.Album.ArtistId == request.LeadArtistId);
            }

            if(request.Title != string.Empty)
            {
                tracks = tracks.Where(t => t.Title.ToLower().Contains(request.Title.ToLower()));
            }

            var filteredTracks = tracks.Select(t => new TrackGetResponse
            {
                Id = t.Id,
                isExplicit = t.isExplicit,
                Length = t.Length,
                Streams = t.Streams,
                Title = t.Title,
                CoverPath = "/media/Images/AlbumCovers/" + t.Album.CoverPath,
                Artists = db.ArtistsTracks.Where(at => at.TrackId == t.Id).Select(at => new ArtistTrackDto
                {
                    Id = at.ArtistId,
                    IsLead = at.IsLead,
                    Name = at.Artist.Name,
                    PfpPath = "/media/Images/ArtistPfps/" + at.Artist.ProfilePhotoPath,
                }).ToList()
            });

            return await MyPagedList<TrackGetResponse>.CreateAsync(filteredTracks, request, cancellationToken);
        }
    }

    public class TrackGetAllRequest : MyPagingRequest
    {
        public int? AlbumId { get; set; }
        public int? LeadArtistId { get; set; }
        public List<int>? FeaturedArtists { get; set; }
        public string Title { get; set; } = string.Empty;
    }
}
