namespace AdriCarRental.API.DTOs;

public record CarDto(int Id, string Make, string Model, int Year, decimal Price, string Image, bool IsBooked, bool IsFavorite);

public record CreateCarDto(string Make, string Model, int Year, decimal Price, string? Image);

public record UpdateCarDto(string Make, string Model, int Year, decimal Price, string? Image);
