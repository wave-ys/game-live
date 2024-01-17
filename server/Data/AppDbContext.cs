using GameLiveServer.Models;
using Microsoft.EntityFrameworkCore;

namespace GameLiveServer.Data;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<AppUser> AppUsers { get; set; } = default!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AppUser>().Property(u => u.Id).HasDefaultValueSql("gen_random_uuid()");
        modelBuilder.Entity<AppUser>().HasIndex(u => u.ExternalId).IsUnique();
    }
}