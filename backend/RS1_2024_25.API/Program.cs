using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models.Mail;
using RS1_2024_25.API.Data.Models.Stripe;
using RS1_2024_25.API.Helper.Auth;
using RS1_2024_25.API.Hubs;
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

        

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];

                // If the request is for our hub...
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) &&
                    (path.StartsWithSegments("/notificationsHub") || path.StartsWithSegments("/chatHub")))
                {
                    // Read the token out of the query string
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    }
);

builder.Services.AddSignalR();

builder.Services.AddStackExchangeRedisCache(opt =>
{
    opt.Configuration = config.GetConnectionString("Redis");
});

//dodajte vaše servise
builder.Services.AddTransient<MyAuthService>();
builder.Services.AddTransient<IMyFileHandler,FileHandler>();
builder.Services.AddTransient<TokenProvider>();
builder.Services.Configure<StripeSettings>(builder.Configuration.GetSection("StripeSettings"));
builder.Services.AddTransient<IMyMailService, MailService>();
builder.Services.Configure<MailSettings>(builder.Configuration.GetSection(nameof(MailSettings)));
builder.Services.AddTransient<DeleteService>();
builder.Services.AddHostedService<MyBackgroundService>();
builder.Services.AddSingleton<IMyCacheService, MyRedisCacheService>();
builder.Services.AddTransient<NotificationTransformerService>();

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



app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(builder.Environment.WebRootPath)),
    RequestPath = "/media"
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapHub<NotificationsHub>("/notificationsHub");
app.MapHub<ChatHub>("/chatHub");

app.Run();
