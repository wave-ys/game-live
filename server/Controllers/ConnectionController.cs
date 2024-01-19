using GameLiveServer.Configuration;
using GameLiveServer.Data;
using GameLiveServer.Protocols;
using GameLiveServer.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GameLiveServer.Controllers;

[ApiController]
[Route("/Api/[controller]")]
public class ConnectionController(
    AppDbContext dbContext,
    AppStreamServerConfiguration configuration,
    StreamProtocols protocols) : ControllerBase
{
    [HttpPost("Generate")]
    [Authorize]
    public async Task<IActionResult> GenerateConnection()
    {
        var appUser = await User.GetAppUserAsync(dbContext);

        var rtmpProtocol = protocols["rtmp"]!;
        await dbContext.LiveStreams.Where(s => s.AppUserId == appUser.Id)
            .ExecuteUpdateAsync(setter => setter
                .SetProperty(s => s.ServerUrl, rtmpProtocol.ServerUrl)
                .SetProperty(s => s.StreamKey, Guid.NewGuid())
            );
        return Ok();
    }

    [HttpPost("Authenticate")]
    public async Task<IActionResult> AuthenticateConnection(AuthenticateConnectionDto body)
    {
        var protocol = protocols[body.Protocol];
        if (protocol == null)
            return BadRequest();

        var streamKey = protocol.ParseStreamKeyFromPath(body.Path);
        if (streamKey == null)
            return BadRequest();

        if (!await dbContext.LiveStreams.AnyAsync(s =>
                s.StreamKey == streamKey &&
                s.ServerUrl == configuration.RtmpAddress + configuration.PathPrefix))
            return BadRequest();

        return Ok();
    }
}

public record AuthenticateConnectionDto(
    string Ip,
    string User,
    string Password,
    string Path,
    string Protocol,
    string Id,
    string Action,
    string Query
);