using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialAPI.Data;
using SocialAPI.DTOs;
using SocialAPI.DTOs.Auth;
using SocialAPI.Models;
using SocialAPI.Services;

namespace SocialAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly JwtService _jwtService;

    public AuthController(
        ApplicationDbContext context,
        JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    // POST: api/Auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
        {
            return BadRequest(new
            {
                message = "Já existe uma conta com este email."
            });
        }

        if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
        {
            return BadRequest(new
            {
                message = "Username já utilizado."
            });
        }

        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        return Created("", new
        {
            user.UserId,
            user.Username,
            user.Email
        });
    }

    // POST: api/Auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null)
        {
            return Unauthorized(new
            {
                message = "Email ou password incorretos."
            });
        }

        bool validPassword =
            BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

        if (!validPassword)
        {
            return Unauthorized(new
            {
                message = "Email ou password incorretos."
            });
        }

        var token = _jwtService.GenerateToken(user);

        return Ok(new
        {
            token,
            user = new
            {
                user.UserId,
                user.Username,
                user.Email
            }
        });
    }
}