namespace GameLiveServer.Protocols;

public interface IStreamProtocol
{
    public string ProtocolName { get; }
    public string SourceType { get; }
    public string ServerUrl { get; }
    public Guid? ParseStreamKeyFromPath(string path);
}