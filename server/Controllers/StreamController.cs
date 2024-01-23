using GameLiveServer.Data;
using GameLiveServer.Security;
using GameLiveServer.Storage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GameLiveServer.Controllers;

[ApiController]
[Route("/Api/[controller]")]
public class StreamController(AppDbContext dbContext, IAppObjectStorage objectStorage) : ControllerBase
{
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetStream()
    {
        var appUser = await User.GetAppUserAsync(dbContext,
            queryable => queryable.Include(u => u.LiveStream));
        return Ok(new
        {
            appUser.LiveStream.Id,
            appUser.LiveStream.ServerUrl,
            appUser.LiveStream.StreamKey,
            appUser.LiveStream.Name,
            appUser.LiveStream.ThumbnailContentType,
            appUser.LiveStream.ChatEnabled,
            appUser.LiveStream.ChatFollowersOnly
        });
    }

    [HttpGet("Thumbnail")]
    public async Task<IActionResult> GetThumbnail([FromQuery(Name = "user")] Guid userId)
    {
        var appUser = await dbContext.AppUsers.Include(u => u.LiveStream).SingleOrDefaultAsync(u => u.Id == userId);
        if (appUser == null || string.IsNullOrEmpty(appUser.LiveStream.ThumbnailPath) ||
            string.IsNullOrEmpty(appUser.LiveStream.ThumbnailContentType))
            return NotFound();

        var stream = new MemoryStream();
        await objectStorage.GetObjectAsync(stream, appUser.LiveStream.ThumbnailPath);
        stream.Seek(0, SeekOrigin.Begin);
        return File(stream, appUser.LiveStream.ThumbnailContentType);
    }

    [HttpPut]
    [Authorize]
    public async Task<IActionResult> UpdateStream([FromForm] UpdateStreamDto dto)
    {
        var appUser = await User.GetAppUserAsync(dbContext, queryable => queryable.Include(u => u.LiveStream));
        var liveStream = appUser.LiveStream;

        if (dto.Thumbnail?.Length > 0)
        {
            if (!string.IsNullOrEmpty(liveStream.ThumbnailPath))
                await objectStorage.RemoveObjectAsync(liveStream.ThumbnailPath);

            var extension = dto.Thumbnail.FileName[(dto.Thumbnail.FileName.LastIndexOf('.') + 1)..];
            var thumbnailPath = "/thumbnail/" + Guid.NewGuid() + "." + extension;
            await objectStorage.SaveObjectAsync(dto.Thumbnail.OpenReadStream(), thumbnailPath,
                dto.Thumbnail.ContentType,
                dto.Thumbnail.Length);
            liveStream.ThumbnailPath = thumbnailPath;
            liveStream.ThumbnailContentType = dto.Thumbnail.ContentType;
        }

        if (dto.Name != null)
            liveStream.Name = dto.Name;

        if (dto.ChatEnabled != null)
            liveStream.ChatEnabled = dto.ChatEnabled.Value;

        if (dto.ChatFollowersOnly != null)
            liveStream.ChatFollowersOnly = dto.ChatFollowersOnly.Value;

        dbContext.LiveStreams.Update(liveStream);
        await dbContext.SaveChangesAsync();
        return Ok();
    }
}

public class UpdateStreamDto
{
    public string? Name { get; set; } = default!;
    public IFormFile? Thumbnail { get; set; } = default!;
    public bool? ChatEnabled { get; set; }
    public bool? ChatFollowersOnly { get; set; }
}