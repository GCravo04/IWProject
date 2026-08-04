using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialAPI.Data;
using SocialAPI.DTOs.Post;
using SocialAPI.Models;
using System.Security.Claims;

namespace SocialAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PostsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/posts
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PostDto>>> GetPosts()
    {
        var posts = await _context.Posts
            .Include(p => p.User)
            .Include(p => p.Likes)
            .Include(p => p.Comments)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new PostDto
            {
                PostId = p.PostId,
                Username = p.User.Username,
                Content = p.Content,
                ImageUrl = p.ImageUrl,
                Likes = p.Likes.Count,
                Comments = p.Comments.Count,
                CreatedAt = p.CreatedAt
            })
            .ToListAsync();

        return Ok(posts);
    }

    // GET: api/posts/5
    [HttpGet("{id}")]
    public async Task<ActionResult<PostDto>> GetPost(int id)
    {
        var post = await _context.Posts
            .Include(p => p.User)
            .Include(p => p.Likes)
            .Include(p => p.Comments)
            .Where(p => p.PostId == id)
            .Select(p => new PostDto
            {
                PostId = p.PostId,
                Username = p.User.Username,
                Content = p.Content,
                ImageUrl = p.ImageUrl,
                Likes = p.Likes.Count,
                Comments = p.Comments.Count,
                CreatedAt = p.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (post == null)
            return NotFound();

        return Ok(post);
    }

    // POST: api/posts
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<PostDto>> CreatePost(CreatePostDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var post = new Post
        {
            UserId = userId,
            Content = dto.Content,
            CreatedAt = DateTime.UtcNow
        };

        _context.Posts.Add(post);

        await _context.SaveChangesAsync();

        var createdPost = await _context.Posts
            .Include(p => p.User)
            .Where(p => p.PostId == post.PostId)
            .Select(p => new PostDto
            {
                UserId = p.UserId,
                PostId = p.PostId,
                Username = p.User.Username,
                Content = p.Content,
                ImageUrl = p.ImageUrl,
                Likes = 0,
                Comments = 0,
                CreatedAt = p.CreatedAt
            })
            .FirstAsync();

        return CreatedAtAction(
            nameof(GetPost),
            new { id = createdPost.PostId },
            createdPost);
    }

    // PUT: api/posts/5
    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePost(int id, UpdatePostDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var post = await _context.Posts.FindAsync(id);

        if (post == null)
            return NotFound();

        if (post.UserId != userId)
            return Forbid();

        post.Content = dto.Content;
        post.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/posts/5
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePost(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var post = await _context.Posts.FindAsync(id);

        if (post == null)
            return NotFound();

        if (post.UserId != userId)
            return Forbid();

        _context.Posts.Remove(post);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}