using System.Security.Claims;
using GameLiveServer.Data;
using GameLiveServer.Models;
using Microsoft.EntityFrameworkCore;

namespace GameLiveServer.Security;

public static class ClaimsPrincipalExtensions
{
    public static async Task<AppUser> GetAppUserAsync(this ClaimsPrincipal user, AppDbContext dbContext,
        Func<IQueryable<AppUser>, IQueryable<AppUser>>? setQueryConditions = null)
    {
        if (user.Identity?.IsAuthenticated != true)
            throw new InvalidOperationException("User not authenticated");

        var externalId = user.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value;

        IQueryable<AppUser> queryable = dbContext.AppUsers;
        if (setQueryConditions != null)
            queryable = setQueryConditions(queryable);
        var appUser = await queryable.SingleOrDefaultAsync(u => u.ExternalId == externalId);
        if (appUser == null)
            throw new Exception("AppUser not found in database");

        return appUser;
    }
}