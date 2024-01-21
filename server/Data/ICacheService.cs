using GameLiveServer.Models;

namespace GameLiveServer.Data;

public interface ICacheService
{
    public Task SetStreamExistAsync(string serverUrl, string streamKey, bool exist);
    public Task RemoveStreamExistAsync(string serverUrl, string streamKey);
    public Task<bool?> IsStreamExistAsync(string serverUrl, string streamKey);

    public Task SetStreamAsync(string username, LiveStream? liveStream);
    public Task RemoveStreamAsync(string username);
    public Task<LiveStream?> GetStreamAsync(string username);

    public Task<long> IncrementStreamViewerAsync(Guid userId);
    public Task<long> DecrementStreamViewerAsync(Guid userId);
}