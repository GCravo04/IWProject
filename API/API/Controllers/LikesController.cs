using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialAPI.Data;
using SocialAPI.Models;
using System.Security.Claims;

namespace SocialAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LikesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public LikesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // POST api/likes/5
    [Authorize]
    [HttpPost("{postId}")]
    public async Task<IActionResult> ToggleLike(int postId)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var postExists = await _context.Posts.AnyAsync(p => p.PostId == postId);

        if (!postExists)
            return NotFound("Post não encontrado.");

        var like = await _context.Likes.FirstOrDefaultAsync(l =>
            l.UserId == userId &&
            l.PostId == postId);

        if (like == null)
        {
            _context.Likes.Add(new Like
            {
                UserId = userId,
                PostId = postId,
                CreatedAt = DateTime.UtcNow
            });
        }
        else
        {
            _context.Likes.Remove(like);
        }

        await _context.SaveChangesAsync();

        var likes = await _context.Likes.CountAsync(l => l.PostId == postId);

        return Ok(new
        {
            likes,
            liked = like == null
        });
    }
}