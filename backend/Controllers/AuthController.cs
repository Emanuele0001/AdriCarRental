using AdriCarRental.API.Data;
using AdriCarRental.API.DTOs;
using AdriCarRental.API.Models;
using AdriCarRental.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AdriCarRental.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AppDbContext db, JwtService jwt) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email && u.Password == dto.Password);
        if (user is null)
            return Unauthorized(new { message = "Invalid email or password" });

        return Ok(new AuthResponseDto(jwt.GenerateToken(user), user.Name, user.Email, user.Role));
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
    {
        if (await db.Users.AnyAsync(u => u.Email == dto.Email))
            return BadRequest(new { message = "Email already registered" });

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            Password = dto.Password,
            Role = "ROLE_USER"
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return Ok(new AuthResponseDto(jwt.GenerateToken(user), user.Name, user.Email, user.Role));
    }
}
