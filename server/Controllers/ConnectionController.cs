using GameLiveServer.Configuration;
using GameLiveServer.Data;
using GameLiveServer.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GameLiveServer.Controllers;

[ApiController]
[Route("/Api/[controller]")]
public class ConnectionController(AppDbContext dbContext, AppStreamServerConfiguration configuration) : ControllerBase
{
    [HttpPost("Generate")]
    [Authorize]
    public async Task<IActionResult> GenerateConnection()
    {
        var appUser = await User.GetAppUserAsync(dbContext);
        await dbContext.LiveStreams.Where(s => s.AppUserId == appUser.Id)
            .ExecuteUpdateAsync(setter => setter
                .SetProperty(s => s.ServerUrl, configuration.RtmpAddress + configuration.PathPrefix)
                .SetProperty(s => s.StreamKey, Guid.NewGuid())
            );
        return Ok();
    }

    [HttpPost("Authenticate")]
    public async Task<IActionResult> AuthenticateConnection(AuthenticateConnectionDto body)
    {
        if (body.Action == "publish")
        {
            if (body.Protocol == "rtmp")
            {
                if (!body.Path.StartsWith(configuration.PathPrefix))
                    return Forbid();

                var streamKey = body.Path[configuration.PathPrefix.Length..];
                if (streamKey.StartsWith('/'))
                    streamKey = streamKey[1..];

                if (!await dbContext.LiveStreams.AnyAsync(s =>
                        s.StreamKey.ToString() == streamKey &&
                        s.ServerUrl == configuration.RtmpAddress + configuration.PathPrefix))
                    return Forbid();
                return Ok();
            }

            return Forbid();
        }

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