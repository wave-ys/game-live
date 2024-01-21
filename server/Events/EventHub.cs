using GameLiveServer.Data;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace GameLiveServer.Events;

public class EventHub(ICacheService cacheService) : Hub
{
    public async Task SubscribeLiveStatus(Guid userId, AppDbContext dbContext)
    {
        var liveStream = await dbContext.LiveStreams.SingleOrDefaultAsync(s => s.AppUserId == userId);
        if (liveStream == null)
            return;
        await Groups.AddToGroupAsync(Context.ConnectionId, "LiveStatus." + userId);
        await Clients.Caller.SendAsync("liveStatus", new LiveStatusEventMessage
        {
            UserId = userId,
            Live = liveStream.Live
        });
    }

    public async Task UnsubscribeLiveStatus(Guid userId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "LiveStatus." + userId);
    }

    public async Task SubscribeStreamViewer(Guid userId, AppDbContext dbContext)
    {
        var liveStream = await dbContext.LiveStreams.SingleOrDefaultAsync(s => s.AppUserId == userId);
        if (liveStream == null)
            return;

        var viewer = await cacheService.IncrementStreamViewerAsync(userId);

        if (!Context.Items.ContainsKey("broadcasters"))
            Context.Items["broadcasters"] = new HashSet<Guid>();
        ((HashSet<Guid>)Context.Items["broadcasters"]!).Add(userId);
        await Groups.AddToGroupAsync(Context.ConnectionId, "StreamViewer." + userId);

        await Clients
            .Group("StreamViewer." + userId)
            .SendAsync("streamViewer", new StreamViewerEventMessage
            {
                UserId = userId,
                Viewer = viewer
            });
    }

    public async Task UnsubscribeStreamViewer(Guid userId, AppDbContext dbContext)
    {
        var liveStream = await dbContext.LiveStreams.SingleOrDefaultAsync(s => s.AppUserId == userId);
        if (liveStream == null)
            return;

        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "StreamViewer." + userId);

        if (!Context.Items.ContainsKey("broadcasters"))
            return;
        ((HashSet<Guid>)Context.Items["broadcasters"]!).Remove(userId);

        var viewer = await cacheService.DecrementStreamViewerAsync(userId);
        await Clients
            .Group("StreamViewer." + userId)
            .SendAsync("streamViewer", new StreamViewerEventMessage
            {
                UserId = userId,
                Viewer = viewer
            });
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if (!Context.Items.ContainsKey("broadcasters"))
            return;
        var broadcasters = (HashSet<Guid>)Context.Items["broadcasters"]!;
        foreach (var broadcaster in broadcasters)
        {
            var viewer = await cacheService.DecrementStreamViewerAsync(broadcaster);
            await Clients
                .Group("StreamViewer." + broadcaster)
                .SendAsync("streamViewer", new StreamViewerEventMessage
                {
                    UserId = broadcaster,
                    Viewer = viewer
                });
        }
    }
}

public class LiveStatusEventMessage
{
    public Guid UserId { get; set; }
    public bool Live { get; set; }
}

public class StreamViewerEventMessage
{
    public Guid UserId { get; set; }
    public long Viewer { get; set; }
}