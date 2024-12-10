namespace RS1_2024_25.API.Services.Interfaces
{
    public interface IMyFileHandler
    {
        public Task<string> UploadFile(string path, IFormFile file, int maxFileSizeInBytes = 0, CancellationToken cancellationToken = default);
        public void DeleteFile(string path);
    }
}
