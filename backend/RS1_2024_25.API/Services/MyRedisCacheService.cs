using Microsoft.EntityFrameworkCore.Storage.Json;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using RS1_2024_25.API.Services.Interfaces;
using System.Collections.Concurrent;

namespace RS1_2024_25.API.Services
{
    public class MyRedisCacheService(IDistributedCache cache) : IMyCacheService
    {
        private readonly ConcurrentDictionary<string, bool> keys = new();
        private readonly DistributedCacheEntryOptions cacheOptions = new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5) };

    public async Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default) where T : class
        {
            string? result = await cache.GetStringAsync(key, cancellationToken);

            if (result == null)
            {
                return null;
            }

            T? obj = JsonConvert.DeserializeObject<T>(result);
            return obj;
        }

        public async Task<T> GetAsync<T>(string key, Func<Task<T>> factory, CancellationToken cancellationToken = default) where T : class
        {
            T? obj = await GetAsync<T>(key, cancellationToken);

            if (obj != null)
            {
                return obj;
            }

            T res = await factory();
            await SetAsync(key, res, cancellationToken);
            return res;
        }

        public async Task RemoveAsync<T>(string key, CancellationToken cancellationToken = default) where T : class
        {
            await cache.RemoveAsync(key, cancellationToken);
            keys.Remove(key, out bool _);
        }

        public async Task RemoveWithPrefixAsync<T>(string keyPrefix, CancellationToken cancellationToken = default) where T : class
        {
            IEnumerable<Task> tasks = keys.Keys.Where(k => k.StartsWith(keyPrefix)).Select(k => RemoveAsync<T>(k,cancellationToken));
            await Task.WhenAll(tasks);
        }

        public async Task SetAsync<T>(string key, T value, CancellationToken cancellationToken = default) where T : class
        {
            await cache.SetStringAsync(key,JsonConvert.SerializeObject(value), cacheOptions, cancellationToken);
            keys.TryAdd(key, true);
        }
    }
}
