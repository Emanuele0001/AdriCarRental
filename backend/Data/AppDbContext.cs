using AdriCarRental.API.Models;
using Microsoft.EntityFrameworkCore;


namespace AdriCarRental.API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Car> Cars => Set<Car>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<Favorite> Favorites => Set<Favorite>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Favorite>()
            .HasIndex(f => new { f.UserId, f.CarId })
            .IsUnique();

        modelBuilder.Entity<Car>()
            .Property(c => c.Price)
            .HasPrecision(10, 2);

        // Seed default admin
        modelBuilder.Entity<User>().HasData(new User
        {
            Id = 1,
            Name = "Admin",
            Email = "admin@admin.com",
            Password = "admin",
            Role = "ROLE_ADMIN"
        });
    }
}
