using System.Text.Encodings.Web;
using GameLiveServer.Data;
using GameLiveServer.Security;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GameLiveServer.Controllers;

[ApiController]
[Route("/Api/[controller]")]
public class AuthController(AppDbContext dbContext) : ControllerBase
{
    [HttpGet("Login")]
    public async Task Login([FromQuery] string redirect = "/")
    {
        await HttpContext.ChallengeAsync(OpenIdConnectDefaults.AuthenticationScheme,
            new AuthenticationProperties
            {
                RedirectUri = redirect
            });
    }

    [HttpGet("Logout")]
    [Authorize]
    public async Task Logout([FromQuery] string redirect = "/")
    {
        await HttpContext.SignOutAsync(OpenIdConnectDefaults.AuthenticationScheme,
            new AuthenticationProperties
            {
                RedirectUri = "/Api/Auth/Logout-Callback?redirect=" + UrlEncoder.Default.Encode(redirect)
            });
    }

    [HttpGet("Logout-Callback")]
    [Authorize]
    public async Task LogoutCallback([FromQuery] string redirect = "/")
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme,
            new AuthenticationProperties
            {
                RedirectUri = redirect
            });
    }

    [Authorize]
    [HttpGet("Profile")]
    public async Task<IActionResult> Profile()
    {
        return Ok(await User.GetAppUserAsync(dbContext));
    }
}