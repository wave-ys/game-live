namespace GameLiveServer.Security;

public class AppUser
{
    public string Id { get; set; } = default!;
    public string Username { get; set; } = default!;
    public string Email { get; set; } = default!;
    public bool EmailVerified { get; set; }
}