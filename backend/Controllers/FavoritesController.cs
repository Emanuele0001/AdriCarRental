using System.Security.Claims;
using AdriCarRental.API.Data;
using AdriCarRental.API.DTOs;
using AdriCarRental.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AdriCarRental.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FavoritesController(AppDbContext db) : ControllerBase
{
    private int CurrentUserId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<FavoriteDto>>> GetAll()
    {
        var favs = await db.Favorites
            .Where(f => f.UserId == CurrentUserId)
            .Include(f => f.Car)
            .Select(f => new FavoriteDto(
                f.CarId,
                f.Car.Make,
                f.Car.Model,
                f.Car.Year,
                f.Car.Price,
                f.Car.Image
            ))
            .ToListAsync();

        return Ok(favs);
    }

    [HttpPost("{carId}")]
    public async Task<IActionResult> Add(int carId)
    {
        var car = await db.Cars.FindAsync(carId);
        if (car is null) return NotFound(new { message = "Car not found" });

        var exists = await db.Favorites.AnyAsync(f => f.UserId == CurrentUserId && f.CarId == carId);
        if (exists) return BadRequest(new { message = "Already in favorites" });

        db.Favorites.Add(new Favorite { UserId = CurrentUserId, CarId = carId });
        await db.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("{carId}")]
    public async Task<IActionResult> Remove(int carId)
    {
        var fav = await db.Favorites.FirstOrDefaultAsync(f => f.UserId == CurrentUserId && f.CarId == carId);
        if (fav is null) return NotFound();

        db.Favorites.Remove(fav);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
