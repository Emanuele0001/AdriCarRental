namespace AdriCarRental.API.DTOs;

public record FavoriteDto(int CarId, string Make, string Model, int Year, decimal Price, string Image);
