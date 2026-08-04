namespace SocialAPI.DTOs.User;

public class UserDto
{
    public int UserId { get; set; }

    public string Username { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string? Bio { get; set; }

    public string? ProfileImageUrl { get; set; }

    public DateTime CreatedAt { get; set; }

    public int Posts { get; set; }

    public int Followers { get; set; }

    public int Following { get; set; }
}