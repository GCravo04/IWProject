namespace SocialAPI.DTOs.Comment;

public class CommentDto
{
    public int UserId { get; set; }
    public int CommentId { get; set; }

    public string Username { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}