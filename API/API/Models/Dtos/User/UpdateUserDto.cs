using System.ComponentModel.DataAnnotations;

namespace SocialAPI.DTOs.User;

public class UpdateUserDto
{
    [Required]
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    public string? Bio { get; set; }

    public string? ProfileImageUrl { get; set; }
}