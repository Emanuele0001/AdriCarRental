namespace AdriCarRental.API.Models;

public class Car
{
    public int Id { get; set; }
    public string Make { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int Year { get; set; }
    public decimal Price { get; set; }
    public string Image { get; set; } = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80";

    public ICollection<Booking> Bookings { get; set; } = [];
    public ICollection<Favorite> Favorites { get; set; } = [];
}
