using System.Text.Json;
using GameLiveServer.Models;
using Microsoft.Extensions.Caching.Distributed;
using StackExchange.Redis;

namespace GameLiveServer.Data;

public class CacheService(IDistributedCache cache, IConnectionMultiplexer connectionMultiplexer) : ICacheService
{
    public async Task SetStreamExistAsync(string serverUrl, string streamKey, bool exist)
    {
        await cache.SetStringAsync(
            $"StreamKey.Exist.[{serverUrl}].[{streamKey}]",
            exist ? "true" : "false",
            new DistributedCacheEntryOptions
            {
                SlidingExpiration = TimeSpan.FromHours(2)
            });
    }

    public async Task RemoveStreamExistAsync(string serverUrl, string streamKey)
    {
        await cache.RemoveAsync($"StreamKey.Exist.[{serverUrl}].[{streamKey}]");
    }

    public async Task<bool?> IsStreamExistAsync(string serverUrl, string streamKey)
    {
        var existStr = await cache.GetStringAsync($"StreamKey.Exist.[{serverUrl}].[{streamKey}]");
        if (existStr == null)
            return null;
        return existStr == "true";
    }

    public async Task SetStreamAsync(string username, LiveStream? liveStream)
    {
        await cache.SetStringAsync(
            "Stream." + username,
            JsonSerializer.Serialize(liveStream),
            new DistributedCacheEntryOptions
            {
                SlidingExpiration = TimeSpan.FromHours(2)
            });
    }

    public async Task RemoveStreamAsync(string username)
    {
        await cache.RemoveAsync("Stream." + username);
    }

    public async Task<LiveStream?> GetStreamAsync(string username)
    {
        var bytes = await cache.GetAsync("Stream." + username);
        if (bytes == null)
            return null;
        return JsonSerializer.Deserialize<LiveStream>(bytes);
    }

    public async Task<long> IncrementStreamViewerAsync(Guid userId)
    {
        var database = connectionMultiplexer.GetDatabase();
        return await database.StringIncrementAsync(new RedisKey($"StreamViewer.[{userId}]"));
    }

    public async Task<long> DecrementStreamViewerAsync(Guid userId)
    {
        var database = connectionMultiplexer.GetDatabase();
        var result = await database.StringDecrementAsync(new RedisKey($"StreamViewer.[{userId}]"));
        if (result >= 0)
            return result;
        await database.KeyDeleteAsync(new RedisKey($"StreamViewer.[{userId}]"));
        return 0;
    }
}