namespace GameLiveServer.Models;

public class Follow
{
    public Guid Id { get; set; } = default!;

    public Guid FollowerId { get; set; } = default!;
    public AppUser Follower { get; set; } = default!;

    public Guid FollowingId { get; set; } = default!;
    public AppUser Following { get; set; } = default!;

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}