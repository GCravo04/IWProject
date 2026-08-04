using System.ComponentModel.DataAnnotations;

namespace SocialAPI.DTOs.User;

public class UpdateUserDto
{
    [Required]
    public string Username { get; set; } = string.Empty;

    public string? Bio { get; set; }

    public string? ProfileImageUrl { get; set; }
}