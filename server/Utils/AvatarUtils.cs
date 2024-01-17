using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;

namespace GameLiveServer.Utils;

public static class AvatarUtils
{
    public static async Task GenerateRandomAvatar(Stream stream)
    {
        var rand = new Random();

        using var image = new Image<Rgba32>(100, 100);
        for (var x = 0; x < image.Width; x++)
        for (var y = 0; y < image.Height; y++)
        {
            var randomColor = new Rgba32((byte)rand.Next(256), (byte)rand.Next(256), (byte)rand.Next(256));
            image[x, y] = randomColor;
        }

        await image.SaveAsPngAsync(stream);
    }
}