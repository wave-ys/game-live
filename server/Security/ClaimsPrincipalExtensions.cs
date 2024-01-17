using System.Security.Claims;
using GameLiveServer.Data;
using GameLiveServer.Models;
using Microsoft.EntityFrameworkCore;

namespace GameLiveServer.Security;

public static class ClaimsPrincipalExtensions
{
    public static async Task<AppUser> GetAppUserAsync(this ClaimsPrincipal user, AppDbContext dbContext)
    {
        if (user.Identity?.IsAuthenticated != true)
            throw new InvalidOperationException("User not authenticated");

        var externalId = user.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value;

        var appUser = await dbContext.AppUsers.SingleOrDefaultAsync(u => u.ExternalId == externalId);
        if (appUser == null)
            throw new Exception("AppUser not found in database");

        return appUser;
    }
}