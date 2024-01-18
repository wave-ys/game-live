namespace GameLiveServer.Models;

public class LiveStream
{
    public Guid Id { get; set; }

    public string? ServerUrl { get; set; }
    public Guid? StreamKey { get; set; }

    public Guid AppUserId { get; set; }
    public AppUser AppUser { get; set; } = default!;

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}