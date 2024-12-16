namespace RS1_2024_25.API.Services.Interfaces
{
    public interface IMyCacheService
    {
        Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default) where T : class;
        Task<T> GetAsync<T>(string key,Func<Task<T>> factory, CancellationToken cancellationToken = default) where T : class;
        Task SetAsync<T>(string key, T value, CancellationToken cancellationToken = default) where T : class;
        Task RemoveAsync<T>(string key, CancellationToken cancellationToken = default) where T : class;
        Task RemoveWithPrefixAsync<T>(string keyPrefix, CancellationToken cancellationToken = default) where T : class;
    }
}
