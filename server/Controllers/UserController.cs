using GameLiveServer.Data;
using GameLiveServer.Security;
using GameLiveServer.Storage;
using Microsoft.AspNetCore.Authorization;
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
        if (appUser == null || string.IsNullOrEmpty(appUser.AvatarPath) ||
            string.IsNullOrEmpty(appUser.AvatarContentType))
            return NotFound();

        var stream = new MemoryStream();
        await objectStorage.GetObjectAsync(stream, appUser.AvatarPath);
        stream.Seek(0, SeekOrigin.Begin);
        return File(stream, appUser.AvatarContentType);
    }
    
    [HttpGet("Avatar/Me")]
    [Authorize]
    public async Task<IActionResult> GetMyAvatar()
    {
        var appUser = await User.GetAppUserAsync(dbContext);
        if (string.IsNullOrEmpty(appUser.AvatarPath) || string.IsNullOrEmpty(appUser.AvatarContentType))
            return NotFound();
        
        var stream = new MemoryStream();
        await objectStorage.GetObjectAsync(stream, appUser.AvatarPath);
        stream.Seek(0, SeekOrigin.Begin);
        return File(stream, appUser.AvatarContentType);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetUserById(Guid id)
    {
        var user = await dbContext.AppUsers.SingleOrDefaultAsync(u => u.Id == id);
        if (user == null)
            return NotFound();
        return Ok(new
        {
            user.Id,
            user.Username
        });
    }

    [HttpGet("Username/{username}")]
    public async Task<IActionResult> GetUserByUsername(string username)
    {
        var user = await dbContext.AppUsers.SingleOrDefaultAsync(u => u.Username == username);
        if (user == null)
            return NotFound();
        return Ok(new
        {
            user.Id,
            user.Username
        });
    }

    [HttpPut("Avatar")]
    [Authorize]
    public async Task<IActionResult> UpdateAvatar([FromForm] UpdateAvatarDto form)
    {
        if (form.Avatar == null || form.Avatar.Length == 0)
            return Ok();
        
        var appUser = await User.GetAppUserAsync(dbContext);
        if (appUser.AvatarPath != null)
            await objectStorage.RemoveObjectAsync(appUser.AvatarPath);
        
        var extension = form.Avatar.FileName[(form.Avatar.FileName.LastIndexOf('.') + 1)..];
        var avatarPath = "/avatar/" + Guid.NewGuid() + "." + extension;
        await objectStorage.SaveObjectAsync(form.Avatar.OpenReadStream(), avatarPath,
            form.Avatar.ContentType, form.Avatar.Length);

        await dbContext.AppUsers.Where(u => u.Id == appUser.Id).ExecuteUpdateAsync(
            setter => setter
                .SetProperty(u => u.AvatarPath, avatarPath)
                .SetProperty(u => u.AvatarContentType, form.Avatar.ContentType));
        return Ok();
    }
}

public class UpdateAvatarDto
{
    public IFormFile? Avatar { get; set; } = default!;
}