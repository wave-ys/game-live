using GameLiveServer.Data;
using GameLiveServer.Models;
using GameLiveServer.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GameLiveServer.Controllers;

[ApiController]
[Route("/Api/[controller]")]
public class FollowController(AppDbContext dbContext) : ControllerBase
{
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetFollowing()
    {
        var appUser = await User.GetAppUserAsync(dbContext);

        var list = await dbContext.Follows
            .Include(f => f.Following)
            .ThenInclude(u => u.LiveStream)
            .Where(f => f.FollowerId == appUser.Id && f.Following.Blocking.All(b => b.BlockingId != appUser.Id))
            .Select(f => f.Following)
            .Select(u => new
            {
                u.Id,
                u.Username,
                u.LiveStream
            }).ToListAsync();
        return Ok(list);
    }

    [HttpGet("is-following/{other:guid}")]
    [Authorize]
    public async Task<IActionResult> CheckStatus(Guid other)
    {
        var appUser = await User.GetAppUserAsync(dbContext);

        var otherUser = await dbContext.AppUsers.SingleOrDefaultAsync(u => u.Id == other);
        if (otherUser == null)
            return BadRequest("Other user not found");

        var result = await dbContext.Follows.AnyAsync(f => f.FollowerId == appUser.Id && f.FollowingId == otherUser.Id);

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
            await dbContext.Follows.AnyAsync(f => f.FollowerId == appUser.Id && f.FollowingId == otherUser.Id);
        if (current == status)
            return Ok();

        if (status == false)
        {
            await dbContext.Follows.Where(f => f.FollowerId == appUser.Id && f.FollowingId == otherUser.Id)
                .ExecuteDeleteAsync();
            return Ok();
        }

        var now = DateTime.UtcNow;
        var entity = new Follow
        {
            FollowerId = appUser.Id,
            FollowingId = otherUser.Id,
            CreatedAt = now,
            UpdatedAt = now
        };
        dbContext.Follows.Add(entity);
        await dbContext.SaveChangesAsync();
        return Ok();
    }
}