namespace GameLiveServer.Models;

public class Block
{
    public Guid Id { get; set; } = default!;

    public Guid BlockerId { get; set; } = default!;
    public AppUser Blocker { get; set; } = default!;

    public Guid BlockingId { get; set; } = default!;
    public AppUser Blocking { get; set; } = default!;

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}