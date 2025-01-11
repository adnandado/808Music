﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using RS1_2024_25.API.Services.Interfaces;

namespace RS1_2024_25.API.Endpoints.TrackEndpoints
{
    public class TrackStreamEndpoint(ApplicationDbContext db, IMyCacheService cs, IMyFileHandler fh, IConfiguration cfg, TokenProvider tp) : MyEndpointBaseAsync.WithRequest<TrackStreamRequest>.WithActionResult
    {
        //[Authorize]
        [HttpGet]
        public override async Task<ActionResult> HandleAsync([FromQuery] TrackStreamRequest request, CancellationToken cancellationToken = default)
        {
            if(!int.TryParse(tp.GetJwtSub(request.Jwt), out int userId))
            {
                return Unauthorized();
            }
            var user = await db.MyAppUsers.Include(u => u.Subscription)
                            .FirstOrDefaultAsync(u => u.ID == userId, cancellationToken);


            if (user.Subscription == null || user.Subscription.EndDate < DateTime.UtcNow)
            {
                return Unauthorized(new { message = "Your subscription has expired or is not active." });
            }
            //TODO Check for active subscription

            Track? track = request.TrackId <= 0 ? await db.Tracks.FirstOrDefaultAsync(cancellationToken) : await cs.GetAsync<Track>($"track-{request.TrackId}", cancellationToken);
            if(track == null)
            {
                track = await db.Tracks.FindAsync(request.TrackId);
                if (track == null)
                    return BadRequest();
                await cs.SetAsync($"track-{request.TrackId}", track, cancellationToken);
            }

            var stream = await fh.GetFileAsStreamAsync(Path.Combine(cfg["StaticFilePaths:Tracks"]!, track.TrackPath));
            var file = File(stream, "audio/mpeg", enableRangeProcessing: true);

            return file;
        }
    }

    public class TrackStreamRequest
    {
        public int TrackId { get; set; } = -1;
        public string Jwt {  get; set; } = string.Empty;
    }
}
