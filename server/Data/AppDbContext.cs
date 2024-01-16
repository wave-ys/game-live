using Microsoft.EntityFrameworkCore;

namespace GameLiveServer.Data;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
    }
}