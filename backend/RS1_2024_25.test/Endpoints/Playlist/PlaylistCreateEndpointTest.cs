using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Moq;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Endpoints.PlaylistEndpoints;
using RS1_2024_25.API.Services;
using RS1_2024_25.API.Services.Interfaces;
using RS1_2024_25.Tests.Data;
using System;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace RS1_2024_25.Tests.Endpoints.Playlist
{
    public class PlaylistCreateEndpointTests
    {
        ApplicationDbContext db;
        IConfiguration cfg;
        IMyFileHandler fh;
        public PlaylistCreateEndpointTests()
        {
            db = TestApplicationDbContext.CreateTestDbContext().GetAwaiter().GetResult();
            cfg = TestIConfiguration.CreateIConfiguration();
            fh = new TestFileHandler();
        }
      
        [Fact]
        public async Task CreatePlaylistUnauthorizedTest()
        {
            var request = new PlaylistAddRequest
            {
                Title = "Unauthorized Playlist",
                IsPublic = false,
                CoverImage = new FormFile(Stream.Null, 0, 0, "CoverImage", "cover.png")
            };

            var playlistEndpoint = new PlaylistCreateEndpoint(db, new TokenProvider(cfg, db));

            var res = await playlistEndpoint.HandleAsync(request);

            var unauthorized = Assert.IsType<UnauthorizedResult>(res.Result);
        }


    }
}
