using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Endpoints.AuthEndpoints;
using RS1_2024_25.API.Services;
using RS1_2024_25.Tests.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace RS1_2024_25.Tests.Endpoints.Auth
{
    public class UserAuthEndpointTests
    {
        ApplicationDbContext db;
        IConfiguration cfg;
        public UserAuthEndpointTests()
        {
            db = TestApplicationDbContext.CreateTestDbContext().GetAwaiter().GetResult();
            cfg = TestIConfiguration.CreateIConfiguration();
        }

        [Fact]
        public async Task TestLoginWithValidUserPass()
        {
            var loginRequest = new LoginRequest2
            {
                Username = "admin",
                Password = "admin123"
            };

            var context = new DefaultHttpContext();
            context.Request.Headers.Add("Authorization", "Bearer");

            var tokenProvider = new TokenProvider(cfg, db);
            var loginEndpoint = new UserAuthLoginEndpoint(db, tokenProvider, cfg) { ControllerContext = new ControllerContext()
            {
                HttpContext = context
            }};

            var res = await loginEndpoint.HandleAsync(loginRequest);

            //Check if login is successful
            var okResult = Assert.IsType<OkObjectResult>(res.Result);
            var response = Assert.IsType<LoginResponse2>(okResult.Value);

            //Check the JWT and refresh tokens
            Assert.NotNull(response.Token);
            Assert.NotNull(response.RefreshToken);
            Assert.Equal(loginRequest.Username, tokenProvider.GetJwtClaimValue(response.Token, "Username"));
        }

        [Fact]
        public async Task TestLoginWithInvalidUserPass()
        {
            var loginRequest = new LoginRequest2
            {
                Username = "admin",
                Password = "wrong-password"
            };

            var tokenProvider = new TokenProvider(cfg, db);
            var loginEndpoint = new UserAuthLoginEndpoint(db, tokenProvider, cfg);

            var res = await loginEndpoint.HandleAsync(loginRequest);

            //Check if login is successful
            var okResult = Assert.IsType<BadRequestObjectResult>(res.Result);
        }
    }
}
