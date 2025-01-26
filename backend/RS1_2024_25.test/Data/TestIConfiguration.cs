using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RS1_2024_25.Tests.Data
{
    internal class TestIConfiguration
    {
        public static IConfiguration CreateIConfiguration()
        {
            return new ConfigurationBuilder().AddJsonFile("appsettings.test.json").Build();
        }
    }
}
