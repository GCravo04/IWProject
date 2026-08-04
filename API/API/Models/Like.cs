namespace SocialAPI.Models;

public class Like
{
    public int UserId { get; set; }

    public int PostId { get; set; }

    public DateTime CreatedAt { get; set; }

    public User User { get; set; } = null!;

    public Post Post { get; set; } = null!;
}