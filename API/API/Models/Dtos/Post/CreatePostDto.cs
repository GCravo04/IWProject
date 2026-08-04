using System.ComponentModel.DataAnnotations;

namespace SocialAPI.DTOs.Post;

public class CreatePostDto
{
    [Required]
    public string Content { get; set; } = string.Empty;
}