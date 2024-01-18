using GameLiveServer.Data;
using GameLiveServer.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GameLiveServer.Controllers;

[ApiController]
[Route("/Api/[controller]")]
public class StreamController(AppDbContext dbContext) : ControllerBase
{
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetStream()
    {
        var appUser = await User.GetAppUserAsync(dbContext, queryable => queryable.Include(u => u.LiveStream));
        return Ok(new
        {
            appUser.LiveStream.Id,
            appUser.LiveStream.ServerUrl,
            appUser.LiveStream.StreamKey
        });
    }
}