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
                .SelectMany(ts => db.ArtistsTracks
                    .Where(at => at.TrackId == ts.TrackId) 
                    .Select(at => at.Artist))
                .Where(a => a != null) 
                .Distinct() 
                .Select(a => new ArtistInfoResponse
                {
                    ArtistId = a!.Id,
                    ArtistName = a!.Name,
                    ArtistPfp = a!.ProfilePhotoPath,
                    FollowerCount = a.Followers
                })
                .ToListAsync(cancellationToken);

            return Ok(lastStreams);
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
