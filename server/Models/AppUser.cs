namespace GameLiveServer.Models;

public class AppUser
{
    public Guid Id { get; set; }
    public string ExternalId { get; set; } = default!;

    public string Username { get; set; } = default!;
    public string Email { get; set; } = default!;

    public string AvatarPath { get; set; } = default!;
    public string AvatarContentType { get; set; } = default!;

    public LiveStream LiveStream { get; set; } = default!;

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}