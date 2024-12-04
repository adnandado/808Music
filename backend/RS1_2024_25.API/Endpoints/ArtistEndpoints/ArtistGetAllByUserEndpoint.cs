﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Endpoints.TemporaryEndpoints;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.ArtistEndpoints
{
    public class ArtistGetAllByUserEndpoint(ApplicationDbContext db, TokenProvider tp) : MyEndpointBaseAsync.WithoutRequest.WithActionResult<List<ArtistResponse>>
    {
        [Authorize]
        [HttpGet]
        public override async Task<ActionResult<List<ArtistResponse>>> HandleAsync(CancellationToken cancellationToken = default)
        {
            int userId = int.Parse(tp.GetJwtSub(Request));

            return await db.UserArtists.Where(ua => ua.MyAppUserId == userId).Select(ua => new ArtistResponse
            {
                Id = ua.ArtistId,
                Name = ua.Artist.Name,
                PfpPath = $"/media/Images/ArtistPfps/{ua.Artist.ProfilePhotoPath}",
                Role = ua.Role.RoleName
            }).ToListAsync();
        }
    }

    public class ArtistResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string PfpPath { get; set; }
        public string Role { get; set; }
    }
}
