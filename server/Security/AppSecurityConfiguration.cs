namespace GameLiveServer.Security;

public sealed class AppSecurityConfiguration
{
    public required string ClientId { get; set; }
    public required string ClientSecret { get; set; }
    public required string MetadataAddress { get; set; }
}