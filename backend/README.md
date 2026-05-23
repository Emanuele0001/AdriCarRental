# AdriCarRental — Backend Setup

//run project
dotnet run --project backend

http://127.0.0.1:5000 frontend
## Requirements

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [PostgreSQL](https://www.postgresql.org/download/) (running locally on port 5432)

## 1. Configure the database connection

Edit `backend/appsettings.json` and update the connection string with your PostgreSQL credentials:

```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=AdriCarRental;Username=postgres;Password=yourpassword"
}
```

## 2. Install .NET tools and restore packages

```bash
cd backend
dotnet restore
```

## 3. Install EF Core tools (once per machine)

```bash
dotnet tool install --global dotnet-ef
```

## 4. Create and apply the database migration

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

> The database is also auto-migrated on startup, so `dotnet ef database update` is optional after the first run.

## 5. Run the API

```bash
dotnet run
```

The API starts at **http://localhost:5000**.

## API Endpoints

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | /api/auth/login | — | Login, returns JWT |
| POST | /api/auth/register | — | Register, returns JWT |
| GET | /api/cars | optional | List all cars |
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

## Frontend

Open `Project.html` directly in a browser (or serve it via Live Server in VS Code).  
The frontend calls `http://localhost:5000/api` — make sure the backend is running first.
