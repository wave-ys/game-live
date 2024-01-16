using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;

namespace GameLiveServer.Security;

public static class ServiceCollectionExtensions
{
    public static AuthenticationBuilder AddAppAuthentication(this IServiceCollection services,
        IConfiguration configuration, bool isDevelopment)
    {
        return services
            .AddAuthentication(
                options => { options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme; })
            .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme)
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
            });
    }
}