using GameLiveServer.Configuration;

namespace GameLiveServer.Protocols;

public class HlsProtocol(AppStreamServerConfiguration configuration) : IStreamProtocol
{
    public string ProtocolName => "hls";
    public string? SourceType => null;
    public string ServerUrl => configuration.HlsAddress + configuration.PathPrefix;

    public Guid? ParseStreamKeyFromPath(string path)
    {
        if (!path.StartsWith(configuration.PathPrefix))
            return null;

        var str = path[configuration.PathPrefix.Length..];
        if (str.StartsWith('/'))
            str = str[1..];
        if (str.EndsWith("/index.m3u8"))
            str = str[..-"/index.m3u8".Length];

        if (string.IsNullOrEmpty(str) || !Guid.TryParse(str, out var result))
            return null;
        return result;
    }

    public string BuildUrl(Guid streamKey, string? filename)
    {
        return ServerUrl + "/" + streamKey + "/" + (filename ?? "index.m3u8");
    }

    public string BuildFrontUrl(string username)
    {
        return $"/Api/Connection/Stream/Hls/{username}/index.m3u8";
    }
}