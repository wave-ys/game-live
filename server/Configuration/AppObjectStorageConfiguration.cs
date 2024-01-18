namespace GameLiveServer.Configuration;

public sealed class AppObjectStorageConfiguration
{
    public required string Endpoint { get; set; }
    public required string AccessKey { get; set; }
    public required string SecretKey { get; set; }
    public required string BucketName { get; set; }
    public required bool UseSsl { get; set; }
}