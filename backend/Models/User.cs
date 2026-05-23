namespace AdriCarRental.API.Models;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = "ROLE_USER";

    public ICollection<Booking> Bookings { get; set; } = [];
    public ICollection<Favorite> Favorites { get; set; } = [];
}
