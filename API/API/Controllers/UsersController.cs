using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialAPI.Data;
using SocialAPI.DTOs.User;
using SocialAPI.Models;
using System.Security.Claims;

namespace SocialAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UsersController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/users
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
    {
        var users = await _context.Users
            .Select(u => new UserDto
            {
                UserId = u.UserId,
                Username = u.Username,
                Bio = u.Bio,
                ProfileImageUrl = u.ProfileImageUrl
            })
            .ToListAsync();

        return Ok(users);
    }

    // GET: api/users/5
    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        var user = await _context.Users
            .Where(u => u.UserId == id)
            .Select(u => new UserDto
            {
                UserId = u.UserId,
                Username = u.Username,
                Bio = u.Bio,
                ProfileImageUrl = u.ProfileImageUrl
            })
            .FirstOrDefaultAsync();

        if (user == null)
            return NotFound();

        return Ok(user);
    }

    // GET: api/User/profile
    [Authorize]
    [HttpGet("profile")]
    public async Task<ActionResult<UserDto>> GetProfile()
    {
        var id = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var user = await _context.Users
            .Where(u => u.UserId == id)
            .Select(u => new UserDto
            {
                UserId = u.UserId,
                Username = u.Username,
                Email = u.Email,
                Bio = u.Bio,
                ProfileImageUrl = u.ProfileImageUrl,
                CreatedAt = u.CreatedAt,

                Posts = u.Posts.Count(),

                Followers = u.Followers.Count(),

                Following = u.Following.Count()
            })
            .FirstOrDefaultAsync();

        if (user == null)
            return NotFound();

        return Ok(user);
    }

    // PUT: api/users/profile
    [Authorize]
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile(UpdateUserDto dto)
    {
        var id = int.Parse(User.FindFirstValue("userid")!);

        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return NotFound();

        user.Username = dto.Username;
        user.Bio = dto.Bio;
        user.ProfileImageUrl = dto.ProfileImageUrl;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/users/profile
    [Authorize]
    [HttpDelete("profile")]
    public async Task<IActionResult> DeleteProfile()
    {
        var id = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return NotFound();

        _context.Users.Remove(user);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}