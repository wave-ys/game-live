using Minio;

namespace GameLiveServer.Storage;

public static class ServiceCollectionExtensions
{
    public static void AddAppObjectStorage(this IServiceCollection services, IConfiguration configuration)
    {
        var settings = configuration.GetRequiredSection("MinIO").Get<AppObjectStorageConfiguration>();
        if (settings == null)
            throw new InvalidOperationException("Cannot read MinIO configuration");

        services
            .AddMinio(client => client
                .WithEndpoint(settings.Endpoint)
                .WithSSL(settings.UseSsl)
                .WithCredentials(settings.AccessKey, settings.SecretKey))
            .AddSingleton(settings)
            .AddSingleton<IAppObjectStorage, AppObjectStorage>();
    }
}