using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Endpoints.DataSeed;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RS1_2024_25.Tests.Data
{
    internal class TestApplicationDbContext
    {
        public static async Task<ApplicationDbContext> CreateTestDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options;

            var context = new ApplicationDbContext(options);

            var dataSeed = new DataSeedGenerateEndpoint(context);

            await dataSeed.HandleAsync();

            return context;
        }
    }
}
