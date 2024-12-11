using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models.Mail;
using RS1_2024_25.API.Helper.Auth;
using RS1_2024_25.API.Services;
using RS1_2024_25.API.Services.Interfaces;
using System.Text;
using static RS1_2024_25.API.Endpoints.CityEndpoints.ProductGetAllEndpoint;


var config = new ConfigurationBuilder()
.AddJsonFile("appsettings.json", false)
.Build();

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(config.GetConnectionString("db1")));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(x => {
    x.OperationFilter<MyAuthorizationSwaggerHeader>();
    var security = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        In = ParameterLocation.Header,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        Description = "Enter your JWT for authorization.",
    };
    x.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, security);

    x.AddSecurityRequirement(new OpenApiSecurityRequirement {
        {
            new OpenApiSecurityScheme {
                Reference = new OpenApiReference {
                    Type = ReferenceType.SecurityScheme,
                        Id = JwtBearerDefaults.AuthenticationScheme
                }
            },
            []
        }
    });
});
builder.Services.AddHttpContextAccessor();
builder.Services.AddAuthorization();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(
    options =>
    {
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]!)),
            ClockSkew = TimeSpan.Zero
        };
    }
);

//dodajte vaše servise
builder.Services.AddTransient<MyAuthService>();
builder.Services.AddTransient<IMyFileHandler,FileHandler>();
builder.Services.AddTransient<TokenProvider>();
builder.Services.AddTransient<IMyMailService, MailService>();
builder.Services.Configure<MailSettings>(builder.Configuration.GetSection(nameof(MailSettings)));
builder.Services.AddTransient<DeleteService>();
builder.Services.AddHostedService<MyBackgroundService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors(
    options => options
        .SetIsOriginAllowed(x => _ = true)
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()
); //This needs to set everything allowed


app.MapGet("/api/ProductGetAll", async (ApplicationDbContext db) =>
{
    var result = await db.Products
                         .Select(p => new ProductGetAllResponse
                         {
                             ID = p.Id,
                             Title = p.Title,
                             Price = p.Price,
                             Quantity = p.QtyInStock,
                             isDigital = p.IsDigital
                         })
                         .ToArrayAsync();

    return result;
});


app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(builder.Environment.WebRootPath)),
    RequestPath = "/media"
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
