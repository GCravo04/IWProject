using System.ComponentModel.DataAnnotations;

namespace SocialAPI.DTOs.Comment;

public class CreateCommentDto
{
    [Required]
    public int PostId { get; set; }

    [Required]
    public string Content { get; set; } = string.Empty;
}