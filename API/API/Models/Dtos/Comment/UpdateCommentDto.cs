using System.ComponentModel.DataAnnotations;

namespace SocialAPI.DTOs.Comment;

public class UpdateCommentDto
{
    [Required]
    public string Content { get; set; } = string.Empty;
}