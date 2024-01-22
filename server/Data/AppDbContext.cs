using GameLiveServer.Models;
using Microsoft.EntityFrameworkCore;

namespace GameLiveServer.Data;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<AppUser> AppUsers { get; set; } = default!;

    public DbSet<LiveStream> LiveStreams { get; set; } = default!;

    public DbSet<BroadcasterViewer> BroadcasterViewers { get; set; } = default!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AppUser>().Property(u => u.Id).HasDefaultValueSql("gen_random_uuid()");
        modelBuilder.Entity<AppUser>().HasIndex(u => u.ExternalId).IsUnique();
        modelBuilder.Entity<AppUser>().HasIndex(u => u.Username).IsUnique();

        modelBuilder.Entity<LiveStream>().Property(s => s.Id).HasDefaultValueSql("gen_random_uuid()");
        modelBuilder.Entity<LiveStream>().HasIndex(s => s.AppUserId).IsUnique();
        modelBuilder.Entity<LiveStream>().HasIndex(s => s.StreamKey).IsUnique();

        modelBuilder.Entity<BroadcasterViewer>().Property(v => v.Id).HasDefaultValueSql("gen_random_uuid()");
        modelBuilder.Entity<BroadcasterViewer>()
            .HasIndex(v => new { v.ConnectionId, v.ViewerId, v.BroadcasterId })
            .IsUnique();
        modelBuilder.Entity<AppUser>()
            .HasMany<BroadcasterViewer>(u => u.Broadcasters)
            .WithOne(v => v.Viewer);
        modelBuilder.Entity<AppUser>()
            .HasMany<BroadcasterViewer>(u => u.Viewers)
            .WithOne(v => v.Broadcaster);
    }
}