using Minio;
using Minio.DataModel.Args;

namespace GameLiveServer.Storage;

public class AppObjectStorage(AppObjectStorageConfiguration configuration, IMinioClient minioClient) : IAppObjectStorage
{
    public async Task SaveObjectAsync(Stream stream, string storePath, string contentType, long size)
    {
        if (!await minioClient.BucketExistsAsync(new BucketExistsArgs().WithBucket(configuration.BucketName)))
            await minioClient.MakeBucketAsync(new MakeBucketArgs().WithBucket(configuration.BucketName));

        await minioClient.PutObjectAsync(
            new PutObjectArgs()
                .WithBucket(configuration.BucketName)
                .WithObject(storePath)
                .WithContentType(contentType)
                .WithStreamData(stream)
                .WithObjectSize(size)
        );
    }

    public async Task GetObjectAsync(Stream stream, string storePath)
    {
        if (!await minioClient.BucketExistsAsync(new BucketExistsArgs().WithBucket(configuration.BucketName)))
            await minioClient.MakeBucketAsync(new MakeBucketArgs().WithBucket(configuration.BucketName));

        await minioClient.GetObjectAsync(
            new GetObjectArgs()
                .WithBucket(configuration.BucketName)
                .WithObject(storePath)
                .WithCallbackStream((s, cancellationToken) => s.CopyToAsync(stream, cancellationToken))
        );
    }

    public async Task RemoveObjectAsync(string storePath)
    {
        if (!await minioClient.BucketExistsAsync(new BucketExistsArgs().WithBucket(configuration.BucketName)))
            await minioClient.MakeBucketAsync(new MakeBucketArgs().WithBucket(configuration.BucketName));

        await minioClient.RemoveObjectAsync(
            new RemoveObjectArgs()
                .WithBucket(configuration.BucketName)
                .WithObject(storePath)
        );
    }
}