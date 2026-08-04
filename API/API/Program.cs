using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SocialAPI.Configuration;
using SocialAPI.Data;
using System.Text;
using SocialAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// ========================================
// Database
// ========================================

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(connectionString));

// ========================================
// JWT
// ========================================

builder.Services.AddScoped<JwtService>();
builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("Jwt"));

var jwtSettings = builder.Configuration
    .GetSection("Jwt")
    .Get<JwtSettings>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme =
        JwtBearerDefaults.AuthenticationScheme;

    options.DefaultChallengeScheme =
        JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters =
        new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwtSettings!.Issuer,
            ValidAudience = jwtSettings.Audience,

            IssuerSigningKey =
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(jwtSettings.Key))
        };
});

// ========================================
// Controllers
// ========================================

builder.Services.AddControllers();

// ========================================
// Swagger
// ========================================

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

// ========================================
// CORS
// ========================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// ========================================
// Pipeline
// ========================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("ReactPolicy");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();