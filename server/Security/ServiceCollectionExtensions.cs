using System.Net.Mime;
using System.Security.Claims;
using GameLiveServer.Data;
using GameLiveServer.Models;
using GameLiveServer.Storage;
using GameLiveServer.Utils;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.EntityFrameworkCore;

namespace GameLiveServer.Security;

public static class ServiceCollectionExtensions
{
    public static AuthenticationBuilder AddAppAuthentication(this IServiceCollection services,
        IConfiguration configuration, bool isDevelopment)
    {
        return services
            .AddAuthentication(
                options =>
                {
                    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    options.DefaultForbidScheme = FailedAuthenticationDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = FailedAuthenticationDefaults.AuthenticationScheme;
                })
            .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddScheme<AuthenticationSchemeOptions, FailedAuthenticationHandler>(
                FailedAuthenticationDefaults.AuthenticationScheme,
                _ => { })
            .AddOpenIdConnect(OpenIdConnectDefaults.AuthenticationScheme, options =>
            {
                options.ClientId = configuration.GetValue<string>("OIDC:ClientId") ??
                                   throw new InvalidOperationException("OIDC Client not found");
                options.ClientSecret = configuration.GetValue<string>("OIDC:ClientSecret") ??
                                       throw new InvalidOperationException("OIDC Secret not found");

                options.ResponseType = "code";
                options.SaveTokens = true;

                options.CallbackPath = "/Api/Auth/SignIn-Callback";
                options.SignedOutCallbackPath = "/Api/Auth/SignOut-Callback";

                options.MetadataAddress = configuration.GetValue<string>("OIDC:MetadataAddress") ??
                                          throw new InvalidOperationException("OIDC metadata address not found");
                if (isDevelopment)
                    options.RequireHttpsMetadata = false;

                options.Events = new OpenIdConnectEvents
                {
                    OnTicketReceived = OnTicketReceived
                };
            });
    }

    private static async Task OnTicketReceived(TicketReceivedContext context)
    {
        var claims = context.Principal?.Claims.ToDictionary(claim => claim.Type);
        if (claims == null)
            throw new Exception("Principle is null");

        var externalId = claims[ClaimTypes.NameIdentifier].Value;

        var dbContext = context.HttpContext.RequestServices.GetRequiredService<AppDbContext>();
        if (await dbContext.AppUsers.AnyAsync(u => u.ExternalId == externalId))
            return;

        var avatarPath = "/avatar/" + Guid.NewGuid() + ".png";
        var objectStorage = context.HttpContext.RequestServices.GetRequiredService<IAppObjectStorage>();
        using var stream = new MemoryStream();
        await AvatarUtils.GenerateRandomAvatar(stream);
        stream.Seek(0, SeekOrigin.Begin);
        await objectStorage.SaveObjectAsync(stream, avatarPath, MediaTypeNames.Image.Png, stream.Length);

        var now = DateTime.UtcNow;
        var appUser = new AppUser
        {
            ExternalId = externalId,
            Username = claims["preferred_username"].Value,
            Email = claims[ClaimTypes.Email].Value,
            AvatarPath = avatarPath,
            AvatarContentType = MediaTypeNames.Image.Png,
            LiveStream = new LiveStream
            {
                CreatedAt = now,
                UpdatedAt = now
            },
            CreatedAt = now,
            UpdatedAt = now
        };
        dbContext.AppUsers.Add(appUser);
        await dbContext.SaveChangesAsync();
    }
}