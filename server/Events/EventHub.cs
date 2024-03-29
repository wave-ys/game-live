using GameLiveServer.Data;
using GameLiveServer.Models;
using GameLiveServer.Security;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace GameLiveServer.Events;

public class EventHub(ICacheService cacheService, AppDbContext dbContext) : Hub
{
    public async Task SubscribeLiveStatus(Guid userId)
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

    public async Task SubscribeStreamViewer(Guid userId)
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

    public async Task UnsubscribeStreamViewer(Guid userId)
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

    public async Task SubscribeChatUsers(Guid userId)
    {
        var liveStream = await dbContext.LiveStreams.SingleOrDefaultAsync(s => s.AppUserId == userId);
        if (liveStream == null)
            return;
        if (Context.User?.Identity?.IsAuthenticated == true)
        {
            var viewer = await Context.User.GetAppUserAsync(dbContext);
            if (userId != viewer.Id)
            {
                dbContext.BroadcasterViewers.Add(new BroadcasterViewer
                {
                    BroadcasterId = userId,
                    ViewerId = viewer.Id,
                    ConnectionId = Context.ConnectionId
                });
                await dbContext.SaveChangesAsync();
            }
        }

        var list = await dbContext.AppUsers
            .Where(u => u.Id == userId)
            .SelectMany(u => u.Viewers)
            .Select(v => v.Viewer)
            .Select(u => new
            {
                u.Id,
                u.Username,
                Blocked = u.Blockers.Any(b => b.BlockerId == userId)
            })
            .ToListAsync();

        await Groups.AddToGroupAsync(Context.ConnectionId, "StreamViewerUser." + userId);
        await Clients.Group("StreamViewerUser." + userId).SendAsync("streamViewerUsers", new
        {
            UserId = userId,
            Users = list
        });
    }

    public async Task UnsubscribeChatUsers(Guid userId)
    {
        var liveStream = await dbContext.LiveStreams.SingleOrDefaultAsync(s => s.AppUserId == userId);
        if (liveStream == null)
            return;
        if (Context.User?.Identity?.IsAuthenticated == true)
        {
            var viewer = await Context.User.GetAppUserAsync(dbContext);
            if (userId != viewer.Id)
                await dbContext.BroadcasterViewers.Where(v =>
                        v.ViewerId == viewer.Id && v.BroadcasterId == userId && v.ConnectionId == Context.ConnectionId)
                    .ExecuteDeleteAsync();
        }

        var list = await dbContext.AppUsers
            .Where(u => u.Id == userId)
            .SelectMany(u => u.Viewers)
            .Select(v => v.Viewer)
            .Select(u => new
            {
                u.Id,
                u.Username,
                Blocked = u.Blockers.Any(b => b.BlockerId == userId)
            })
            .ToListAsync();

        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "StreamViewerUser." + userId);
        await Clients.Group("StreamViewerUser." + userId).SendAsync("streamViewerUsers", new
        {
            UserId = userId,
            Users = list
        });
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if (!Context.Items.ContainsKey("broadcasters"))
            return;
        await dbContext.BroadcasterViewers.Where(v => v.ConnectionId == Context.ConnectionId).ExecuteDeleteAsync();
        var appUser = Context.User == null ? null : await Context.User.GetAppUserAsync(dbContext);

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

            if (appUser != null && appUser.Id == broadcaster)
                continue;

            var list = await dbContext.AppUsers
                .Where(u => u.Id == broadcaster)
                .SelectMany(u => u.Viewers)
                .Select(v => v.Viewer)
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    Blocked = u.Blockers.Any(b => b.BlockerId == broadcaster)
                })
                .ToListAsync();
            await Clients.Group("StreamViewerUser." + broadcaster).SendAsync("streamViewerUsers", new
            {
                UserId = broadcaster,
                Users = list
            });
        }
    }

    public async Task SubscribeChat(Guid userId)
    {
        var random = new Random();
        Context.Items["color"] = $"#{random.Next(50, 200):X2}{random.Next(50, 200):X2}{random.Next(50, 200):X2}";
        await Groups.AddToGroupAsync(Context.ConnectionId, "StreamChatUser." + userId);
    }

    public async Task UnsubscribeChat(Guid userId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "StreamChatUser." + userId);
    }

    public async Task SendChat(Guid userId, string text)
    {
        if (string.IsNullOrEmpty(text))
            return;
        if (Context.User == null)
            return;
        var appUser = await Context.User.GetAppUserAsync(dbContext);
        var liveStream = await dbContext.LiveStreams.SingleOrDefaultAsync(s => s.AppUserId == userId);
        if (liveStream == null || (!liveStream.ChatEnabled && userId != appUser.Id))
            return;
        if (liveStream.ChatFollowersOnly &&
            !await dbContext.Follows.AnyAsync(f => f.FollowerId == appUser.Id && f.FollowingId == userId))
            return;
        if (await dbContext.Blocks.AnyAsync(b => b.BlockingId == appUser.Id && b.BlockerId == userId))
            return;
        await Clients.OthersInGroup("StreamChatUser." + userId).SendAsync("chat", new
        {
            Id = Guid.NewGuid(),
            Broadcaster = userId,
            Color = Context.Items.ContainsKey("color") ? Context.Items["color"] : null,
            UserId = appUser.Id,
            appUser.Username,
            Text = text,
            Time = DateTime.UtcNow,
            Self = false
        });
        await Clients.Caller.SendAsync("chat", new
        {
            Id = Guid.NewGuid(),
            Broadcaster = userId,
            Color = Context.Items.ContainsKey("color") ? Context.Items["color"] : null,
            UserId = appUser.Id,
            appUser.Username,
            Text = text,
            Time = DateTime.UtcNow,
            Self = true
        });
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