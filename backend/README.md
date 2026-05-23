# AdriCarRental — Backend Setup

//run project
dotnet run --project backend

http://127.0.0.1:5000 frontend
## Requirements

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [PostgreSQL](https://www.postgresql.org/download/) running on port 5432

## Setup

**1. Copy the env file and fill in your PostgreSQL password:**
```
cp .env.example .env
```
Edit `.env` and set your password in `ConnectionStrings__DefaultConnection`.

**2. Run the backend (from the repo root):**
```
dotnet run --project backend
```

The database and tables are created automatically on first run.

**3. Open the app:**
```
http://127.0.0.1:5000
```

## Default admin account

- Email: `admin@admin.com`
- Password: `admin`

## API Endpoints

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | /api/auth/login | — | Login |
| POST | /api/auth/register | — | Register |
| GET | /api/cars | — | List all cars |
| POST | /api/cars | Admin | Add a car |
| PUT | /api/cars/{id} | Admin | Edit a car |
| DELETE | /api/cars/{id} | Admin | Delete a car |
| GET | /api/bookings | User/Admin | List bookings |
| POST | /api/bookings | User | Book a car |
| DELETE | /api/bookings/{id} | User/Admin | Cancel booking |
| GET | /api/favorites | User | List favorites |
| POST | /api/favorites/{carId} | User | Add favorite |
| DELETE | /api/favorites/{carId} | User | Remove favorite |

## Default admin account

- Email: `admin@admin.com`
- Password: `admin`

