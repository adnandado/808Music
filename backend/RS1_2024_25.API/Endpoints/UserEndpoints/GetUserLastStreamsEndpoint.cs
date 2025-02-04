using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;

namespace RS1_2024_25.API.Endpoints.UserEndpoints
{
    public class GetUserLastStreamsEndpoint(ApplicationDbContext db)
        : MyEndpointBaseAsync.WithRequest<int>.WithActionResult<List<ArtistInfoResponse>>
    {
        [HttpGet]
        public override async Task<ActionResult<List<ArtistInfoResponse>>> HandleAsync(int UserId, CancellationToken cancellationToken)
        {
            var lastStreams = await db.TrackStream
      .Where(ts => ts.UserId == UserId)
      .OrderByDescending(ts => ts.StreamedAt)
      .ToListAsync(cancellationToken);

            var artistStreams = lastStreams
                .Select(ts => new
                {
                    ts.StreamedAt,
                    Artist = db.ArtistsTracks
                        .Where(at => at.TrackId == ts.TrackId)
                        .Select(at => at.Artist)
                        .FirstOrDefault() 
                })
                .Where(x => x.Artist != null) 
                .GroupBy(x => x.Artist!.Id) 
                .Select(g => g.OrderByDescending(x => x.StreamedAt).First()) 
                .OrderByDescending(x => x.StreamedAt) 
                .Select(x => new ArtistInfoResponse
                {
                    ArtistId = x.Artist!.Id,
                    ArtistName = x.Artist!.Name,
                    ArtistPfp = x.Artist!.ProfilePhotoPath,
                    FollowerCount = x.Artist!.Followers
                })
                .ToList();

            return Ok(artistStreams);


        }
    }

    public class ArtistInfoResponse
    {
        public int ArtistId { get; set; }
        public string ArtistName { get; set; }
        public string ArtistPfp { get; set; }
        public int FollowerCount { get; set; }
    }
}
