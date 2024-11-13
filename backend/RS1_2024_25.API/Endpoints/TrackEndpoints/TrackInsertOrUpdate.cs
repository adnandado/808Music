using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;

namespace RS1_2024_25.API.Endpoints.TrackEndpoints
{
    public class TrackInsertOrUpdate(ApplicationDbContext db) : MyEndpointBaseAsync.WithRequest<TrackInsertRequest>.WithActionResult<TrackInsertResponse>
    {
        [HttpPost]
        public override async Task<ActionResult<TrackInsertResponse>> HandleAsync([FromForm] TrackInsertRequest request, CancellationToken cancellationToken = default)
        {
            Track t = new Track();
            string path = @"C:\808Music\backend\RS1_2024_25.API\TrackFiles\" + request.Title.Replace(" ","_") + "_" +DateTime.UtcNow.ToString("dd_MM_yyyy-HH-mm-ss-fff")+".mp3";
            //validate file size
            if(request.TrackFile.Length <= 0)
            {
                return BadRequest("File invalid");
            }
            //create file
            using (var fs = new FileStream(path,FileMode.CreateNew,FileAccess.Write))
            {
                await request.TrackFile.CopyToAsync(fs, cancellationToken);
            }

            t.Title = request.Title;
            t.TrackPath = path;
            t.isExplicit = request.isExplicit;
            t.AlbumId = db.Albums.FirstOrDefault().Id;

            db.Tracks.Add(t);
            await db.SaveChangesAsync();


            return Ok(new TrackInsertResponse
            {
                Id = t.Id,
                Title = t.Title,
                MainArtist = "bob"
            });
        }
    }

    public class TrackInsertRequest
    {
        public int? Id { get; set; }
        public string Title { get; set; }
        public IFormFile TrackFile { get; set; }
        public bool isExplicit { get; set; }
        public int? AlbumId { get; set; }
        public int? CreditsId { get; set; }
        public List<ArtistTrack> Artists { get; set; }
    }

    public class TrackInsertResponse
    {
        public int? Id { get; set; }
        public string Title { get; set; }
        public string MainArtist {  get; set; }

    }
}
