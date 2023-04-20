using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RusticShopAPI.Data;
using RusticShopAPI.Data.Models.Users;
using RusticShopAPI.Services;
using RusticShopAPI.Services.Mail;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true;
    });

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"));
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddIdentity<User, IdentityRole>(options =>
{
    options.SignIn.RequireConfirmedAccount = true;
    options.User.RequireUniqueEmail = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
})
    .AddDefaultTokenProviders()
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options => options.TokenValidationParameters = new TokenValidationParameters
    {
        RequireExpirationTime = true,
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            builder.Configuration["JwtSettings:Key"]))
    });

builder.Services.AddScoped<JwtHandler>();

// Setting SMTP
builder.Services.Configure<MailSettings>(
    builder.Configuration.GetSection("Mail"));
builder.Services.AddTransient<IMailService, MailService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
var scope = app.Services.CreateScope();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    // Recreating database
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.EnsureDeleted();
    dbContext.Database.EnsureCreated();

    // Creating default roles
    var roleManager = scope
        .ServiceProvider
        .GetRequiredService<RoleManager<IdentityRole>>();
    var roleNames = new string[]
    {
        app.Configuration["Roles:Cx"]!,
        app.Configuration["Roles:Admin"]!
    };
    foreach (var role in roleNames)
    {
        var existingRole = await roleManager.FindByNameAsync(role);
        if (existingRole == null)
        {
            var creation = await roleManager.CreateAsync(new IdentityRole
            {
                Name = role
            });

            if (!creation.Succeeded)
            {
                throw new Exception("No se pudieron crear los roles por defecto");
            }
        }
    }

    // Creating admin in dev
    var admin = new User
    {
        UserName = "ton1uwu",
        Email = "packageinstaller2@gmail.com",
        EmailConfirmed = true,
        LockoutEnabled = false,
    };

    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
    var result = await userManager.CreateAsync(admin, "Flordeloto1!");
    if (!result.Succeeded)
    {
        throw new Exception("No se pudo crear el administrador");
    }

    var addedToAdministrators = await userManager.AddToRoleAsync(admin, "Administrator");
    if (!addedToAdministrators.Succeeded)
    {
        throw new Exception("No se pudo asignar el administrador");
    }

    var isInRole = await userManager.IsInRoleAsync(admin, "Administrator");
    if (!isInRole)
    {
        throw new Exception("No se pudo asignar el administrador");
    }
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();