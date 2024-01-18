using GameLiveServer.Configuration;
using GameLiveServer.Data;
using GameLiveServer.Security;
using GameLiveServer.Storage;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));
builder.Services.AddControllers();

builder.Services.AddHttpClient();

builder.Services.AddAppAuthentication(builder.Configuration, builder.Environment.IsDevelopment());

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Database")));

builder.Services.AddAppObjectStorage(builder.Configuration);

builder.Services.AddSingleton(
    builder.Configuration.GetRequiredSection("StreamServer").Get<AppStreamServerConfiguration>() ??
    throw new InvalidOperationException("Cannot read StreamServer configuration")
);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapReverseProxy();

app.Run();