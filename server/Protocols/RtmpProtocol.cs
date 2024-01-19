using GameLiveServer.Configuration;

namespace GameLiveServer.Protocols;

public class RtmpProtocol(AppStreamServerConfiguration configuration) : IStreamProtocol
{
    public string ProtocolName => "rtmp";
    public string SourceType => "rtmpConn";
    public string ServerUrl { get; init; } = configuration.RtmpAddress + configuration.PathPrefix;

    public Guid? ParseStreamKeyFromPath(string path)
    {
        if (!path.StartsWith(configuration.PathPrefix))
            return null;

        var str = path[configuration.PathPrefix.Length..];
        if (str.StartsWith('/'))
            str = str[1..];

        if (string.IsNullOrEmpty(str) || !Guid.TryParse(str, out var result))
            return null;
        return result;
    }
}