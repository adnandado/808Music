﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;

namespace RS1_2024_25.API.Endpoints.AlbumEndpoints
{
    public class AlbumGetByIdEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync.WithRequest<int>.WithActionResult<AlbumGetResponse>
    {
        [Authorize]
        [HttpGet("{id}")]
        public override async Task<ActionResult<AlbumGetResponse>> HandleAsync(int id, CancellationToken cancellationToken = default)
        {
            Album a = await db.Albums.FindAsync(id, cancellationToken);

            if(a == null)
                return NotFound();

            int numOfTracks = await db.Tracks.Where(t => t.AlbumId == id).CountAsync(cancellationToken);
            bool isExplicit = await db.Tracks.Where(t => t.AlbumId == id && t.isExplicit).CountAsync(cancellationToken) > 0;
            int seconds = await db.Tracks.Where(t => t.AlbumId == id).Select(t => t.Length).SumAsync();

            await db.AlbumTypes.LoadAsync(cancellationToken);
            var response = new AlbumGetResponse
            {
                Id = a.Id,
                Artist = await db.Artists.FindAsync(a.ArtistId,cancellationToken),
                CoverPath = a.CoverPath != "" ? $"/media/Images/AlbumCovers/{a.CoverPath}" : "",
                Distributor = a.Distributor,
                NumOfTracks = numOfTracks,
                ReleaseDate = a.ReleaseDate,
                Title = a.Title,
                Type = a.AlbumType,
                IsActive = a.IsActive,
                IsExpicit = isExplicit,
                LengthInSeconds = seconds
            };

            return Ok(response);
        }
    }

    public class AlbumGetResponse
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Distributor { get; set; } = string.Empty;
        public bool IsExpicit { get; set; }
        public DateTime ReleaseDate { get; set; }
        public AlbumType Type { get; set; }
        public string CoverPath { get; set; }
        public int NumOfTracks { get; set; }
        public Artist Artist { get; set; }
        public bool IsActive { get; set; }
        public int LengthInSeconds { get; set; }
    }
}
