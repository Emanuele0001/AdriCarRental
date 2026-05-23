namespace AdriCarRental.API.DTOs;

public record CreateBookingDto(int CarId, DateTime StartDate, DateTime EndDate);

public record BookingDto(
    int Id,
    int CarId,
    string CarName,
    string UserName,
    string UserEmail,
    DateTime StartDate,
    DateTime EndDate
);
