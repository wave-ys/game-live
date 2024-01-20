using GameLiveServer.Data;
using GameLiveServer.Events;
using GameLiveServer.Protocols;
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
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Cache");
    options.InstanceName = "GameLive.";
});
builder.Services.AddAppEventBus(builder.Configuration);
builder.Services.AddAppObjectStorage(builder.Configuration);

builder.Services.AddSingleton(
    builder.Configuration.GetRequiredSection("StreamServer").Get<AppStreamServerConfiguration>() ??
    throw new InvalidOperationException("Cannot read StreamServer configuration")
);

builder.Services.AddSingleton<StreamProtocols>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (app.Environment.IsProduction())
    app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapReverseProxy();

using (var scope = app.Services.CreateScope())
{
    var dataContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dataContext.Database.Migrate();
}

app.Run();