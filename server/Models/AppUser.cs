namespace GameLiveServer.Models;

public class AppUser
{
    public ICollection<BroadcasterViewer> Broadcasters = default!;
    public Guid Id { get; set; }
    public string ExternalId { get; set; } = default!;

    public string Username { get; set; } = default!;
    public string Email { get; set; } = default!;

    public string? AvatarPath { get; set; }
    public string? AvatarContentType { get; set; }

    public LiveStream LiveStream { get; set; } = default!;
    public ICollection<BroadcasterViewer> Viewers { get; set; } = default!;

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}