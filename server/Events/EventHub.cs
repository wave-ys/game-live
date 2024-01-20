using GameLiveServer.Data;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace GameLiveServer.Events;

public class EventHub : Hub
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
}

public class LiveStatusEventMessage
{
    public Guid UserId { get; set; }
    public bool Live { get; set; }
}