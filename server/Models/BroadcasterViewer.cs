namespace GameLiveServer.Models;

public class BroadcasterViewer
{
    public Guid Id { get; set; }

    public AppUser Broadcaster { get; set; } = default!;
    public Guid BroadcasterId { get; set; }

    public AppUser Viewer { get; set; } = default!;
    public Guid ViewerId { get; set; }

    public string ConnectionId { get; set; } = default!;
}