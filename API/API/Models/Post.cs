using System.ComponentModel.DataAnnotations;

namespace SocialAPI.Models;

public class Post
{
    [Key]
    public int PostId { get; set; }

    public int UserId { get; set; }

    [Required]
    public string Content { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public User User { get; set; } = null!;

    public ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public ICollection<Like> Likes { get; set; } = new List<Like>();
}