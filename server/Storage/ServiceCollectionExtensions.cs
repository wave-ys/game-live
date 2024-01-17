using Minio;

namespace GameLiveServer.Storage;

public static class ServiceCollectionExtensions
{
    public static void AddAppObjectStorage(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddMinio(client => client
                .WithEndpoint(configuration.GetValue<string>("MinIO:Endpoint") ??
                              throw new InvalidOperationException("MinIO Endpoint not found"))
                .WithSSL(configuration.GetValue<bool?>("MinIO:UseSSL") ??
                         throw new InvalidOperationException("MinIO UseSSL configuration not found"))
                .WithCredentials(
                    configuration.GetValue<string>("MinIO:AccessKey") ??
                    throw new InvalidOperationException("MinIO Access Key not found"),
                    configuration.GetValue<string>("MinIO:SecretKey") ??
                    throw new InvalidOperationException("MinIO Access Key not found")
                ))
            .AddSingleton<IAppObjectStorage, AppObjectStorage>();
    }
}