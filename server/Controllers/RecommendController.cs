using GameLiveServer.Data;
using GameLiveServer.Models;
using GameLiveServer.Security;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GameLiveServer.Controllers;

[ApiController]
[Route("/Api/[controller]")]
public class RecommendedController(AppDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetRecommended()
    {
        IQueryable<AppUser> queryable = dbContext.AppUsers.Include(u => u.LiveStream);
        if (User.Identity?.IsAuthenticated == true)
        {
            var appUser = await User.GetAppUserAsync(dbContext);
            queryable = queryable.Where(u =>
                u.Id != appUser.Id && u.Followers.All(t => t.FollowerId != appUser.Id) &&
                u.Blocking.All(b => b.BlockingId != appUser.Id));
        }

        var users = await queryable.Include(u => u.LiveStream).OrderByDescending(u => u.CreatedAt).Select(u => new
        {
            u.Id,
            u.Username,
            IsLive = u.LiveStream.Live,
            StreamName = u.LiveStream.Name
        }).OrderBy(t => t.IsLive ? 0 : 1).ToListAsync();

        return Ok(users);
    }
}