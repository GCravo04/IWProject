using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialAPI.Data;
using SocialAPI.DTOs.Comment;
using SocialAPI.Models;
using System.Security.Claims;

namespace SocialAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CommentsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/comments/post/5
    [HttpGet("post/{postId}")]
    public async Task<ActionResult<IEnumerable<CommentDto>>> GetComments(int postId)
    {
        var comments = await _context.Comments
            .Include(c => c.User)
            .Where(c => c.PostId == postId)
            .OrderBy(c => c.CreatedAt)
            .Select(c => new CommentDto
            {
                CommentId = c.CommentId,
                Username = c.User.Username,
                Content = c.Content,
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();

        return Ok(comments);
    }

    // POST: api/comments
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<CommentDto>> CreateComment(CreateCommentDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var postExists = await _context.Posts.AnyAsync(p => p.PostId == dto.PostId);

        if (!postExists)
            return NotFound("Post não encontrado.");

        var comment = new Comment
        {
            UserId = userId,
            PostId = dto.PostId,
            Content = dto.Content,
            CreatedAt = DateTime.UtcNow
        };

        _context.Comments.Add(comment);

        await _context.SaveChangesAsync();

        var createdComment = await _context.Comments
            .Include(c => c.User)
            .Where(c => c.CommentId == comment.CommentId)
            .Select(c => new CommentDto
            {
                UserId = c.UserId,
                CommentId = c.CommentId,
                Username = c.User.Username,
                Content = c.Content,
                CreatedAt = c.CreatedAt
            })
            .FirstAsync();

        return CreatedAtAction(
            nameof(GetComments),
            new { postId = dto.PostId },
            createdComment);
    }

    // PUT: api/comments/5
    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateComment(int id, UpdateCommentDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var comment = await _context.Comments.FindAsync(id);

        if (comment == null)
            return NotFound();

        if (comment.UserId != userId)
            return Forbid();

        comment.Content = dto.Content;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/comments/5
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteComment(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var comment = await _context.Comments.FindAsync(id);

        if (comment == null)
            return NotFound();

        if (comment.UserId != userId)
            return Forbid();

        _context.Comments.Remove(comment);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}