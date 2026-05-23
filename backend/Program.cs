using System.Text;
using AdriCarRental.API.Data;
using AdriCarRental.API.Services;
using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;

Env.Load(Path.Combine(Directory.GetCurrentDirectory(), "..", ".env"));

// Treat all DateTime as UTC for PostgreSQL (avoids Kind=Unspecified errors)
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var jwtKey = builder.Configuration["Jwt:Key"]!;
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddScoped<JwtService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// Serve frontend from repo root (parent of backend/)
var frontendPath = Path.GetFullPath(Path.Combine(builder.Environment.ContentRootPath, ".."));
var fileProvider = new PhysicalFileProvider(frontendPath);

app.UseDefaultFiles(new DefaultFilesOptions
{
    FileProvider = fileProvider,
    DefaultFileNames = ["Project.html"]
});
app.UseStaticFiles(new StaticFileOptions { FileProvider = fileProvider });

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run("http://127.0.0.1:5000");
