using GameLiveServer.Models;
using Microsoft.EntityFrameworkCore;

namespace GameLiveServer.Data;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<AppUser> AppUsers { get; set; } = default!;

    public DbSet<LiveStream> LiveStreams { get; set; } = default!;

    public DbSet<BroadcasterViewer> BroadcasterViewers { get; set; } = default!;

    public DbSet<Follow> Follows { get; set; } = default!;

    public DbSet<Block> Blocks { get; set; } = default!;

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

        modelBuilder.Entity<Follow>().Property(f => f.Id).HasDefaultValueSql("gen_random_uuid()");
        modelBuilder.Entity<Follow>().HasIndex(f => new { f.FollowerId, f.FollowingId }).IsUnique();

        modelBuilder.Entity<Follow>()
            .HasOne(f => f.Follower)
            .WithMany(u => u.Following)
            .HasForeignKey(f => f.FollowerId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Follow>()
            .HasOne(f => f.Following)
            .WithMany(u => u.Followers)
            .HasForeignKey(f => f.FollowingId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Block>().Property(b => b.Id).HasDefaultValueSql("gen_random_uuid()");
        modelBuilder.Entity<Block>().HasIndex(b => new { b.BlockerId, b.BlockingId }).IsUnique();

        modelBuilder.Entity<Block>()
            .HasOne(b => b.Blocker)
            .WithMany(u => u.Blocking)
            .HasForeignKey(b => b.BlockerId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Block>()
            .HasOne(b => b.Blocking)
            .WithMany(u => u.Blockers)
            .HasForeignKey(b => b.BlockingId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}