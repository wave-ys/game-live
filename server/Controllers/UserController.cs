using GameLiveServer.Data;
using GameLiveServer.Storage;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GameLiveServer.Controllers;

[ApiController]
[Route("/Api/[controller]")]
public class UserController(AppDbContext dbContext, IAppObjectStorage objectStorage) : ControllerBase
{
    [HttpGet("Avatar")]
    public async Task<IActionResult> GetAvatar([FromQuery(Name = "user")] string userId)
    {
        var appUser = await dbContext.AppUsers.SingleOrDefaultAsync(u => u.Id.ToString() == userId);
        if (appUser == null)
            return NotFound();

        var stream = new MemoryStream();
        await objectStorage.GetObjectAsync(stream, appUser.AvatarPath);
        stream.Seek(0, SeekOrigin.Begin);
        return File(stream, appUser.AvatarContentType);
    }
}