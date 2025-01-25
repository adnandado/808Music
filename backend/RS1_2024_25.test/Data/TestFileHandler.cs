using Microsoft.AspNetCore.Http;
using RS1_2024_25.API.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RS1_2024_25.Tests.Data
{
    public class TestFileHandler : IMyFileHandler
    {
        public void DeleteFile(string path)
        {
            return;
        }

        public Task<Stream> GetFileAsStreamAsync(string path, CancellationToken cancellationToken = default)
        {
            return Task.FromResult(Stream.Null);
        }

        public Task<string> UploadFileAsync(string path, IFormFile file, int maxFileSizeInBytes = 0, CancellationToken cancellationToken = default)
        {
            return Task.FromResult<string>(file.FileName);
        }
    }
}
