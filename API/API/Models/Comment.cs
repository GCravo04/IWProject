using System.ComponentModel.DataAnnotations;

namespace SocialAPI.Models;

public class Comment
{
    [Key]
    public int CommentId { get; set; }

    public int UserId { get; set; }

    public int PostId { get; set; }

    [Required]
    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public User User { get; set; } = null!;

    public Post Post { get; set; } = null!;
}