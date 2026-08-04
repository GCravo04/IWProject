using System.ComponentModel.DataAnnotations;

namespace SocialAPI.Models;

public class User
{
    [Key]
    public int UserId { get; set; }

    [Required]
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    public string? Bio { get; set; }

    public string? ProfileImageUrl { get; set; }

    public DateTime CreatedAt { get; set; }

    public ICollection<Post> Posts { get; set; } = new List<Post>();

    public ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public ICollection<Like> Likes { get; set; } = new List<Like>();

    public ICollection<Follow> Following { get; set; } = new List<Follow>();

    public ICollection<Follow> Followers { get; set; } = new List<Follow>();
}