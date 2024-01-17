using Minio;
using Minio.DataModel.Args;

namespace GameLiveServer.Storage;

public class AppObjectStorage(IConfiguration configuration, IMinioClient minioClient) : IAppObjectStorage
{
    private readonly string _bucketName = configuration.GetValue<string>("MinIO:BucketName")
                                          ?? throw new InvalidOperationException("MinIO Bucket name not found");

    public async Task SaveObjectAsync(Stream stream, string storePath, string contentType, long size)
    {
        if (!await minioClient.BucketExistsAsync(new BucketExistsArgs().WithBucket(_bucketName)))
            await minioClient.MakeBucketAsync(new MakeBucketArgs().WithBucket(_bucketName));

        await minioClient.PutObjectAsync(
            new PutObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(storePath)
                .WithContentType(contentType)
                .WithStreamData(stream)
                .WithObjectSize(size)
        );
    }

    public async Task GetObjectAsync(Stream stream, string storePath)
    {
        if (!await minioClient.BucketExistsAsync(new BucketExistsArgs().WithBucket(_bucketName)))
            await minioClient.MakeBucketAsync(new MakeBucketArgs().WithBucket(_bucketName));

        await minioClient.GetObjectAsync(
            new GetObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(storePath)
                .WithCallbackStream((s, cancellationToken) => s.CopyToAsync(stream, cancellationToken))
        );
    }
}