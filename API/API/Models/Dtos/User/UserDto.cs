namespace SocialAPI.DTOs.User;

public class UserDto
{
    public int UserId { get; set; }

    public string Username { get; set; } = string.Empty;

    public string? Bio { get; set; }

    public string? ProfileImageUrl { get; set; }
}