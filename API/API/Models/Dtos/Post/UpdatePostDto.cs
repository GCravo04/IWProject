using System.ComponentModel.DataAnnotations;

namespace SocialAPI.DTOs.Post;

public class UpdatePostDto
{
    [Required]
    public string Content { get; set; } = string.Empty;
}