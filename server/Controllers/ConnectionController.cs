using System.Text.Json;
using GameLiveServer.Data;
using GameLiveServer.Events;
using GameLiveServer.Models;
using GameLiveServer.Protocols;
using GameLiveServer.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;

namespace GameLiveServer.Controllers;

[ApiController]
[Route("/Api/[controller]")]
public class ConnectionController(
    AppDbContext dbContext,
    AppStreamServerConfiguration configuration,
    StreamProtocols protocols,
    HttpClient httpClient,
    IDistributedCache cache,
    IAppEventBus eventBus
) : ControllerBase
{
    [HttpPost("Generate")]
    [Authorize]
    public async Task<IActionResult> GenerateConnection()
    {
        var appUser = await User.GetAppUserAsync(dbContext,
            u => u.Include(t => t.LiveStream)
        );

        var rtmpProtocol = protocols["rtmp"]!;
        await dbContext.LiveStreams.Where(s => s.AppUserId == appUser.Id)
            .ExecuteUpdateAsync(setter => setter
                .SetProperty(s => s.ServerUrl, rtmpProtocol.ServerUrl)
                .SetProperty(s => s.StreamKey, Guid.NewGuid())
            );
        await cache.RemoveAsync("Stream." + appUser.Username);
        await cache.RemoveAsync($"StreamKey.Exist.[{appUser.LiveStream.ServerUrl}].[{appUser.LiveStream.StreamKey}]");
        return Ok();
    }

    [HttpPost("Authenticate")]
    public async Task<IActionResult> AuthenticateConnection(AuthenticateConnectionDto body)
    {
        if (body.Action == "read")
            return Ok();

        var protocol = protocols[body.Protocol];
        if (protocol == null)
            return BadRequest();

        var streamKey = protocol.ParseStreamKeyFromPath(body.Path);
        if (streamKey == null)
            return BadRequest();
        var serverUrl = configuration.RtmpAddress + configuration.PathPrefix;

        var existStr = await cache.GetStringAsync($"StreamKey.Exist.[{serverUrl}].[{streamKey}]");
        var exist = existStr != null
            ? existStr == "true"
            : await dbContext.LiveStreams.AnyAsync(s =>
                s.StreamKey == streamKey &&
                s.ServerUrl == serverUrl);

        if (existStr == null)
            await cache.SetStringAsync(
                $"StreamKey.Exist.[{serverUrl}].[{streamKey}]",
                exist ? "true" : "false",
                new DistributedCacheEntryOptions
                {
                    SlidingExpiration = TimeSpan.FromHours(2)
                });

        if (!exist)
            return BadRequest();

        return Ok();
    }

    [HttpPost("Live")]
    public async Task<IActionResult> MarkLive(
        [FromQuery] bool on,
        [FromQuery] string path,
        [FromQuery(Name = "source_type")] string sourceType
    )
    {
        var protocol = protocols.GetFromSourceType(sourceType);
        if (protocol == null)
            return BadRequest("Unsupported source type");

        var streamKey = protocol.ParseStreamKeyFromPath(path);
        if (streamKey == null)
            return BadRequest("Cannot parse stream key");

        var appUser = await dbContext.AppUsers
            .Where(u => u.LiveStream.StreamKey == streamKey)
            .SingleOrDefaultAsync();
        if (appUser == null)
            return BadRequest("AppUser not found");

        await dbContext.LiveStreams.Where(s => s.StreamKey == streamKey)
            .ExecuteUpdateAsync(setter => setter
                .SetProperty(s => s.Live, on)
                .SetProperty(s => s.UpdatedAt, DateTime.UtcNow)
            );

        await cache.RemoveAsync("Stream." + appUser.Username);
        eventBus.Publish(new LiveStatusEventMessage(appUser.Id, on));
        return Ok();
    }

    [HttpGet("Stream/{username}")]
    public IActionResult GetStream(string username, [FromQuery(Name = "protocol")] string protocolName)
    {
        var protocol = protocols[protocolName];
        if (protocol == null)
            return BadRequest("Unsupported protocol");
        return Redirect(protocol.BuildFrontUrl(username).ToLower());
    }

    [HttpGet("Stream/Hls/{username}/{fileName}")]
    public async Task<IActionResult> GetHlsStream(string username, string filename)
    {
        var protocol = protocols.GetFromProtocolName("hls");
        if (protocol == null)
            return BadRequest("Unsupported protocol");

        var cacheContent = await cache.GetAsync("Stream." + username);
        var liveStream = cacheContent == null ? null : JsonSerializer.Deserialize<LiveStream>(cacheContent);
        if (liveStream == null)
        {
            liveStream = await dbContext.LiveStreams
                .Where(s => s.AppUser.Username == username)
                .SingleOrDefaultAsync();
            await cache.SetStringAsync(
                "Stream." + username,
                JsonSerializer.Serialize(liveStream),
                new DistributedCacheEntryOptions
                {
                    SlidingExpiration = TimeSpan.FromHours(2)
                });
        }

        if (liveStream?.StreamKey == null || liveStream.Live == false)
            return NotFound("Stream not found");

        Response.StatusCode = StatusCodes.Status200OK;
        var response = await httpClient.GetAsync(
            protocol.BuildUrl(liveStream.StreamKey.Value, filename) + QueryString.Create(Request.Query).ToUriComponent()
        );
        await response.Content.CopyToAsync(Response.Body);
        return Empty;
    }
}

public record AuthenticateConnectionDto(
    // string Ip,
    // string User,
    // string Password,
    string Path,
    string Protocol,
    // string Id,
    // string Query,
    string Action
);