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
    StreamProtocols protocols,
    HttpClient httpClient
) : ControllerBase
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
        if (body.Action == "read")
            return Ok();

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

    [HttpPost("Alive")]
    public async Task<IActionResult> MarkAlive(
        [FromQuery] bool on,
        [FromQuery] string path,
        [FromQuery(Name = "source_type")] string sourceType
    )
    {
        var protocol = protocols.GetFromSourceType(sourceType);
        if (protocol == null)
            return BadRequest();

        var streamKey = protocol.ParseStreamKeyFromPath(path);
        if (streamKey == null)
            return BadRequest();

        await dbContext.LiveStreams.Where(s => s.StreamKey == streamKey)
            .ExecuteUpdateAsync(setter => setter
                .SetProperty(s => s.Alive, on)
                .SetProperty(s => s.UpdatedAt, DateTime.UtcNow)
            );
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

        var liveStream = await dbContext.LiveStreams
            .Where(s => s.AppUser.Username == username)
            .SingleOrDefaultAsync();
        if (liveStream?.StreamKey == null || liveStream.Alive == false)
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