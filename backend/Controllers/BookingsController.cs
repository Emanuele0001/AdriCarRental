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
public class BookingsController(AppDbContext db) : ControllerBase
{
    private int CurrentUserId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    private bool IsAdmin =>
        User.IsInRole("ROLE_ADMIN");

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BookingDto>>> GetAll()
    {
        var query = db.Bookings
            .Include(b => b.Car)
            .Include(b => b.User)
            .AsQueryable();

        if (!IsAdmin)
            query = query.Where(b => b.UserId == CurrentUserId);

        var bookings = await query
            .Select(b => new BookingDto(
                b.Id,
                b.CarId,
                $"{b.Car.Make} {b.Car.Model}",
                b.User.Name,
                b.User.Email,
                b.StartDate,
                b.EndDate
            ))
            .ToListAsync();

        return Ok(bookings);
    }

    [HttpPost]
    public async Task<ActionResult<BookingDto>> Create(CreateBookingDto dto)
    {
        var car = await db.Cars.FindAsync(dto.CarId);
        if (car is null) return NotFound(new { message = "Car not found" });

        var alreadyBooked = await db.Bookings.AnyAsync(b =>
            b.CarId == dto.CarId &&
            b.StartDate < dto.EndDate &&
            b.EndDate > dto.StartDate);

        if (alreadyBooked)
            return BadRequest(new { message = "This car is already booked for the selected dates" });

        if (dto.StartDate >= dto.EndDate)
            return BadRequest(new { message = "End date must be after start date" });

        var booking = new Booking
        {
            CarId = dto.CarId,
            UserId = CurrentUserId,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate
        };

        db.Bookings.Add(booking);
        await db.SaveChangesAsync();

        await db.Entry(booking).Reference(b => b.Car).LoadAsync();
        await db.Entry(booking).Reference(b => b.User).LoadAsync();

        return CreatedAtAction(nameof(GetAll), new BookingDto(
            booking.Id,
            booking.CarId,
            $"{booking.Car.Make} {booking.Car.Model}",
            booking.User.Name,
            booking.User.Email,
            booking.StartDate,
            booking.EndDate
        ));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Cancel(int id)
    {
        var booking = await db.Bookings.FindAsync(id);
        if (booking is null) return NotFound();

        if (!IsAdmin && booking.UserId != CurrentUserId)
            return Forbid();

        db.Bookings.Remove(booking);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
