using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Moq;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Endpoints.ArtistEndpoints;
using RS1_2024_25.API.Services;
using RS1_2024_25.API.Services.Interfaces;
using RS1_2024_25.Tests.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RS1_2024_25.Tests.Endpoints.Artist
{
    public class ArtistInsertOrUpdateEndpointTests
    {
        ApplicationDbContext db;
        IConfiguration cfg;
        IMyFileHandler fh;
        public ArtistInsertOrUpdateEndpointTests()
        {
            db = TestApplicationDbContext.CreateTestDbContext().GetAwaiter().GetResult();
            cfg = TestIConfiguration.CreateIConfiguration();
            fh = new TestFileHandler();
        }

        [Fact]
        public async Task CreateArtistTest()
        {
            var user = db.MyAppUsers.First();

            //Get a token for the user
            var tokenProvider = new TokenProvider(cfg, db);
            string token = tokenProvider.Create(user);

            //Create Http context and add JWT Bearer
            var context = new DefaultHttpContext();
            context.Request.Headers.Add("Authorization", $"Bearer {token}");

            var artistEndpoint = new ArtistInsertOrUpdateEndpoint(db, fh, tokenProvider)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = context,
                }
            };

            var request = new ArtistInsertRequest
            {
                Bio = "test",
                Name = "test",
                ProfileBackground = new FormFile(Stream.Null, 0,Stream.Null.Length, "ProfileBackground", "bg.png"),
                ProfilePhoto = new FormFile(Stream.Null, 0, Stream.Null.Length, "ProfilePhoto", "pfp.png"),
            };

            var res = await artistEndpoint.HandleAsync(request);
            
            //Check response
            var okResult = Assert.IsType<OkObjectResult>(res.Result);
            var response = Assert.IsType<ArtistInsertResponse>(okResult.Value);

            //Check values
            Assert.NotNull(response.Name);
            Assert.Equal(request.Name, response.Name);
        }

        [Fact]
        public async Task UpdateArtistValidTest()
        {
            var user = db.MyAppUsers.First();

            //Add artist and user as the owner of the profile
            var artist = new RS1_2024_25.API.Data.Models.Artist { 
                Name = "test",
                Bio = "test",
                DeletionDate = DateTime.MinValue,
                Followers = 10000,
                IsFlaggedForDeletion = false,
                ProfileBackgroundPath = "",
                ProfilePhotoPath = ""
            };

            db.Artists.Add(artist);
            await db.SaveChangesAsync();

            db.UserArtists.Add(new API.Data.Models.UserArtist
            {
                ArtistId = artist.Id,
                MyAppUserId = user.ID,
                RoleId = db.UserArtistRoles.Where(role => role.RoleName == "Owner").FirstOrDefault().Id,
                IsUserOwner = true,
            });
            await db.SaveChangesAsync();

            //Get a token for the user
            var tokenProvider = new TokenProvider(cfg, db);
            string token = tokenProvider.Create(user);

            //Create Http context and add JWT Bearer
            var context = new DefaultHttpContext();
            context.Request.Headers.Add("Authorization", $"Bearer {token}");

            var artistEndpoint = new ArtistInsertOrUpdateEndpoint(db, fh, tokenProvider)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = context,
                }
            };

            var request = new ArtistInsertRequest
            {
                Id = artist.Id,
                Bio = "newTest",
                Name = "newTest",
                ProfileBackground = new FormFile(Stream.Null, 0, Stream.Null.Length, "ProfileBackground", "bg.png"),
                ProfilePhoto = new FormFile(Stream.Null, 0, Stream.Null.Length, "ProfilePhoto", "pfp.png"),
            };

            var res = await artistEndpoint.HandleAsync(request);

            //Check response
            var okResult = Assert.IsType<OkObjectResult>(res.Result);
            var response = Assert.IsType<ArtistInsertResponse>(okResult.Value);

            //Check values
            Assert.NotNull(response.Name);
            Assert.Equal(request.Name, response.Name);

            Assert.NotNull(response.Bio);
            Assert.Equal(request.Bio, response.Bio);
        }

        [Fact]
        public async Task UpdateArtistUnauthorizedTest()
        {
            var user = db.MyAppUsers.First();

            //Add artist and user as the owner of the profile
            var artist = new RS1_2024_25.API.Data.Models.Artist
            {
                Name = "test",
                Bio = "test",
                DeletionDate = DateTime.MinValue,
                Followers = 10000,
                IsFlaggedForDeletion = false,
                ProfileBackgroundPath = "",
                ProfilePhotoPath = ""
            };

            db.Artists.Add(artist);
            await db.SaveChangesAsync();

            db.UserArtists.Add(new API.Data.Models.UserArtist
            {
                ArtistId = artist.Id,
                MyAppUserId = user.ID,
                RoleId = db.UserArtistRoles.Where(role => role.RoleName == "Viewer").FirstOrDefault().Id,
                IsUserOwner = false,
            });
            await db.SaveChangesAsync();

            //Get a token for the user
            var tokenProvider = new TokenProvider(cfg, db);
            string token = tokenProvider.Create(user);

            //Create Http context and add JWT Bearer
            var context = new DefaultHttpContext();
            context.Request.Headers.Add("Authorization", $"Bearer {token}");

            var artistEndpoint = new ArtistInsertOrUpdateEndpoint(db, fh, tokenProvider)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = context,
                }
            };

            var request = new ArtistInsertRequest
            {
                Id = artist.Id,
                Bio = "newTest",
                Name = "newTest",
                ProfileBackground = new FormFile(Stream.Null, 0, Stream.Null.Length, "ProfileBackground", "bg.png"),
                ProfilePhoto = new FormFile(Stream.Null, 0, Stream.Null.Length, "ProfilePhoto", "pfp.png"),
            };

            var res = await artistEndpoint.HandleAsync(request);

            //Check response
            var unauthorized = Assert.IsType<UnauthorizedResult>(res.Result);
        }
    }
}
