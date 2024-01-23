namespace GameLiveServer.Models;

public class LiveStream
{
    public Guid Id { get; set; }

    public bool Live { get; set; }

    public string Name { get; set; } = default!;
    public string? ThumbnailPath { get; set; }
    public string? ThumbnailContentType { get; set; }

    public bool ChatEnabled { get; set; } = true;
    public bool ChatFollowersOnly { get; set; } = false;

    public string? ServerUrl { get; set; }
    public Guid? StreamKey { get; set; }

    public Guid AppUserId { get; set; }
    public AppUser AppUser { get; set; } = default!;

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}