namespace SocialAPI.DTOs.Post;

public class PostDto
{
    
    public int UserId { get; set; }
    public int PostId { get; set; }

    public string Username { get; set; } = string.Empty;

    public string? UserProfileImageUrl { get; set; }

    public string Content { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }

    public int Likes { get; set; }

    public int Comments { get; set; }

    public DateTime CreatedAt { get; set; }
}