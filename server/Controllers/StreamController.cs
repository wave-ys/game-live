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
            appUser.LiveStream.ThumbnailPath,
            appUser.LiveStream.ThumbnailContentType
        });
    }

    [HttpPut]
    [Authorize]
    public async Task<IActionResult> UpdateStream([FromForm] UpdateStreamDto dto)
    {
        var appUser = await User.GetAppUserAsync(dbContext, queryable => queryable.Include(u => u.LiveStream));
        var liveStream = appUser.LiveStream;

        if (dto.Thumbnail != null)
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

        dbContext.LiveStreams.Update(liveStream);
        await dbContext.SaveChangesAsync();
        return Ok();
    }
}

public class UpdateStreamDto
{
    public string? Name { get; set; } = default!;
    public IFormFile? Thumbnail { get; set; } = default!;
}