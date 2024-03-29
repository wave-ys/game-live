using System.Security.Claims;
using GameLiveServer.Data;
using GameLiveServer.Models;
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
        var settings = configuration.GetRequiredSection("OIDC").Get<AppSecurityConfiguration>();
        if (settings == null)
            throw new InvalidOperationException("Cannot read OIDC configuration");

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
                options.ClientId = settings.ClientId;
                options.ClientSecret = settings.ClientSecret;

                options.ResponseType = "code";
                options.SaveTokens = true;

                options.CallbackPath = "/Api/Auth/SignIn-Callback";
                options.SignedOutCallbackPath = "/Api/Auth/SignOut-Callback";

                options.MetadataAddress = settings.MetadataAddress;
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

        var now = DateTime.UtcNow;
        var appUser = new AppUser
        {
            ExternalId = externalId,
            Username = claims["preferred_username"].Value,
            Email = claims[ClaimTypes.Email].Value,
            LiveStream = new LiveStream
            {
                CreatedAt = now,
                UpdatedAt = now,
                Name = claims["preferred_username"].Value + "'s stream"
            },
            CreatedAt = now,
            UpdatedAt = now
        };
        dbContext.AppUsers.Add(appUser);
        await dbContext.SaveChangesAsync();
    }
}