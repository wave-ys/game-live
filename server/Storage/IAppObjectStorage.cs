namespace GameLiveServer.Storage;

public interface IAppObjectStorage
{
    public Task SaveObjectAsync(Stream stream, string storePath, string contentType, long size);
    public Task GetObjectAsync(Stream stream, string storePath);
    public Task RemoveObjectAsync(string storePath);
}