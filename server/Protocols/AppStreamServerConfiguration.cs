namespace GameLiveServer.Protocols;

public sealed class AppStreamServerConfiguration
{
    public required string RtmpAddress { get; set; }
    public required string HlsAddress { get; set; }
    public required string PathPrefix { get; set; }
}