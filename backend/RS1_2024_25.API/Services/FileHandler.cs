using Azure.Core;
using System.Threading;

namespace RS1_2024_25.API.Services
{
    public class FileHandler(IWebHostEnvironment env)
    {
        public async Task<string> UploadFile(string path, IFormFile file, int maxFileSizeInBytes = 0, CancellationToken cancellationToken = default)
        {
            string fullPath = Path.Combine(env.ContentRootPath, path);

            string extension = Path.GetExtension(file.FileName);

            string fileName = Path.GetRandomFileName() + extension;
            if (file.Length > maxFileSizeInBytes && maxFileSizeInBytes > 0 || file.Length <= 0)
            {
                return string.Empty;
            }
            using (var fs = new FileStream(Path.Combine(fullPath, fileName), FileMode.CreateNew, FileAccess.Write))
            {
                await file.CopyToAsync(fs, cancellationToken);
            }
            return fileName;
        }

        public void DeleteFile(string path)
        {
            File.Delete(path);
        }
    }
}
