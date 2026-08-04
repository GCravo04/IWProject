using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialAPI.Data;
using SocialAPI.Models;
using System.Security.Claims;

namespace SocialAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FollowsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public FollowsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // POST api/follows/3
    [Authorize]
    [HttpPost("{followingId}")]
    public async Task<IActionResult> ToggleFollow(int followingId)
    {
        var followerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        if (followerId == followingId)
            return BadRequest("Não podes seguir-te a ti próprio.");

        var userExists = await _context.Users.AnyAsync(u => u.UserId == followingId);

        if (!userExists)
            return NotFound("Utilizador não encontrado.");

        var follow = await _context.Follows.FirstOrDefaultAsync(f =>
            f.FollowerId == followerId &&
            f.FollowingId == followingId);

        if (follow == null)
        {
            _context.Follows.Add(new Follow
            {
                FollowerId = followerId,
                FollowingId = followingId,
                CreatedAt = DateTime.UtcNow
            });
        }
        else
        {
            _context.Follows.Remove(follow);
        }

        await _context.SaveChangesAsync();

        var followers = await _context.Follows.CountAsync(f =>
            f.FollowingId == followingId);

        return Ok(new
        {
            followers,
            following = follow == null
        });
    }

    // GET api/follows/followers/3
    [HttpGet("followers/{userId}")]
    public async Task<IActionResult> GetFollowers(int userId)
    {
        var followers = await _context.Follows
            .Include(f => f.Follower)
            .Where(f => f.FollowingId == userId)
            .Select(f => new
            {
                f.Follower.UserId,
                f.Follower.Username,
                f.Follower.ProfileImageUrl
            })
            .ToListAsync();

        return Ok(followers);
    }

    // GET api/follows/following/3
    [HttpGet("following/{userId}")]
    public async Task<IActionResult> GetFollowing(int userId)
    {
        var following = await _context.Follows
            .Include(f => f.Following)
            .Where(f => f.FollowerId == userId)
            .Select(f => new
            {
                f.Following.UserId,
                f.Following.Username,
                f.Following.ProfileImageUrl
            })
            .ToListAsync();

        return Ok(following);
    }
}