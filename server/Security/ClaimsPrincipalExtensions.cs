using System.Security.Claims;
using GameLiveServer.Data;

namespace GameLiveServer.Security;

public static class ClaimsPrincipalExtensions
{
    public static async Task<AppUser> GetAppUserAsync(this ClaimsPrincipal user, AppDbContext dbContext)
    {
        if (user.Identity?.IsAuthenticated != true)
            throw new InvalidOperationException("User not authenticated");

        await Task.CompletedTask;

        return new AppUser
        {
            Id = user.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value,
            Username = user.Claims.First(c => c.Type == "preferred_username").Value,
            Email = user.Claims.First(c => c.Type == ClaimTypes.Email).Value,
            EmailVerified = user.Claims.First(c => c.Type == "email_verified").Value == "true"
        };
    }
}