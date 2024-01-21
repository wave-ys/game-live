using GameLiveServer.Data;
using GameLiveServer.Events;
using GameLiveServer.Protocols;
using GameLiveServer.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
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
    ICacheService cacheService,
    IHubContext<EventHub> hubContext)
    : ControllerBase
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
        await cacheService.RemoveStreamAsync(appUser.Username);
        if (appUser.LiveStream.ServerUrl is not null && appUser.LiveStream.StreamKey is not null)
            await cacheService.RemoveStreamExistAsync(appUser.LiveStream.ServerUrl,
                appUser.LiveStream.StreamKey.Value.ToString());
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

        var exist = await cacheService.IsStreamExistAsync(serverUrl, streamKey.Value.ToString());

        if (exist == null)
        {
            exist = await dbContext.LiveStreams.AnyAsync(s =>
                s.StreamKey == streamKey &&
                s.ServerUrl == serverUrl);
            await cacheService.SetStreamExistAsync(serverUrl, streamKey.Value.ToString(), exist.Value);
        }

        if (!exist.Value)
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

        await cacheService.RemoveStreamAsync(appUser.Username);
        await hubContext.Clients
            .Groups("LiveStatus." + appUser.Id)
            .SendAsync("liveStatus", new LiveStatusEventMessage
            {
                UserId = appUser.Id,
                Live = on
            });
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

        var liveStream = await cacheService.GetStreamAsync(username);
        if (liveStream == null)
        {
            liveStream = await dbContext.LiveStreams
                .Where(s => s.AppUser.Username == username)
                .SingleOrDefaultAsync();
            await cacheService.SetStreamAsync(username, liveStream);
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