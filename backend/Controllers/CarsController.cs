using System.Security.Claims;
using AdriCarRental.API.Data;
using AdriCarRental.API.DTOs;
using AdriCarRental.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AdriCarRental.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CarsController(AppDbContext db) : ControllerBase
{
    private int? CurrentUserId =>
        int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : null;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CarDto>>> GetAll()
    {
        var userId = CurrentUserId;

        var bookedCarIds = (await db.Bookings.Select(b => b.CarId).ToListAsync()).ToHashSet();
        var favoriteCarIds = userId.HasValue
            ? (await db.Favorites.Where(f => f.UserId == userId).Select(f => f.CarId).ToListAsync()).ToHashSet()
            : new HashSet<int>();

        var cars = await db.Cars
            .Select(c => new CarDto(
                c.Id,
                c.Make,
                c.Model,
                c.Year,
                c.Price,
                c.Image,
                bookedCarIds.Contains(c.Id),
                favoriteCarIds.Contains(c.Id)
            ))
            .ToListAsync();

        return Ok(cars);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CarDto>> GetById(int id)
    {
        var userId = CurrentUserId;
        var car = await db.Cars.FindAsync(id);
        if (car is null) return NotFound();

        var isBooked = await db.Bookings.AnyAsync(b => b.CarId == id);
        var isFavorite = userId.HasValue && await db.Favorites.AnyAsync(f => f.CarId == id && f.UserId == userId);

        return Ok(new CarDto(car.Id, car.Make, car.Model, car.Year, car.Price, car.Image, isBooked, isFavorite));
    }

    [Authorize(Roles = "ROLE_ADMIN")]
    [HttpPost]
    public async Task<ActionResult<CarDto>> Create(CreateCarDto dto)
    {
        var car = new Car
        {
            Make = dto.Make,
            Model = dto.Model,
            Year = dto.Year,
            Price = dto.Price,
            Image = dto.Image ?? "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80"
        };

        db.Cars.Add(car);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = car.Id },
            new CarDto(car.Id, car.Make, car.Model, car.Year, car.Price, car.Image, false, false));
    }

    [Authorize(Roles = "ROLE_ADMIN")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateCarDto dto)
    {
        var car = await db.Cars.FindAsync(id);
        if (car is null) return NotFound();

        car.Make = dto.Make;
        car.Model = dto.Model;
        car.Year = dto.Year;
        car.Price = dto.Price;
        if (dto.Image is not null) car.Image = dto.Image;

        await db.SaveChangesAsync();
        return NoContent();
    }

    [Authorize(Roles = "ROLE_ADMIN")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var car = await db.Cars.FindAsync(id);
        if (car is null) return NotFound();

        db.Cars.Remove(car);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
