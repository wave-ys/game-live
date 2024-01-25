using GameLiveServer.Data;
using GameLiveServer.Events;
using GameLiveServer.Models;
using GameLiveServer.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace GameLiveServer.Controllers;

[ApiController]
[Route("/Api/[controller]")]
public class BlockController(AppDbContext dbContext, IHubContext<EventHub> hubContext) : ControllerBase
{
    [HttpGet("is-blocked-by/{other:guid}")]
    public async Task<IActionResult> CheckStatus(Guid other)
    {
        if (User.Identity?.IsAuthenticated != true)
            return Ok("false");
        var appUser = await User.GetAppUserAsync(dbContext);

        var otherUser = await dbContext.AppUsers.SingleOrDefaultAsync(u => u.Id == other);
        if (otherUser == null)
            return BadRequest("Other user not found");

        var result = await dbContext.Blocks.AnyAsync(b => b.BlockingId == appUser.Id && b.BlockerId == otherUser.Id);

        return Ok(result ? "true" : "false");
    }

    [HttpPost("toggle")]
    [Authorize]
    public async Task<IActionResult> ToggleStatus([FromQuery] Guid other, [FromQuery] bool status)
    {
        var appUser = await User.GetAppUserAsync(dbContext);

        var otherUser = await dbContext.AppUsers.SingleOrDefaultAsync(u => u.Id == other);
        if (otherUser == null)
            return BadRequest("Other user not found");

        var current =
            await dbContext.Blocks.AnyAsync(b => b.BlockerId == appUser.Id && b.BlockingId == otherUser.Id);
        if (current == status)
            return Ok();

        if (status == false)
        {
            await dbContext.Blocks.Where(b => b.BlockerId == appUser.Id && b.BlockingId == otherUser.Id)
                .ExecuteDeleteAsync();
            await SendChatUsersEvent(appUser.Id);
            return Ok();
        }

        var now = DateTime.UtcNow;
        var entity = new Block
        {
            BlockerId = appUser.Id,
            BlockingId = otherUser.Id,
            CreatedAt = now,
            UpdatedAt = now
        };
        dbContext.Blocks.Add(entity);
        await dbContext.SaveChangesAsync();
        await SendChatUsersEvent(appUser.Id);
        return Ok();
    }

    private async Task SendChatUsersEvent(Guid userId)
    {
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

        await hubContext.Clients.Group("StreamViewerUser." + userId).SendAsync("streamViewerUsers", new
        {
            UserId = userId,
            Users = list
        });
    }
}