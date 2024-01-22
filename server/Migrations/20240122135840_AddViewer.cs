using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GameLiveServer.Migrations
{
    /// <inheritdoc />
    public partial class AddViewer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BroadcasterViewers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    BroadcasterId = table.Column<Guid>(type: "uuid", nullable: false),
                    ViewerId = table.Column<Guid>(type: "uuid", nullable: false),
                    ConnectionId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BroadcasterViewers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BroadcasterViewers_AppUsers_BroadcasterId",
                        column: x => x.BroadcasterId,
                        principalTable: "AppUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BroadcasterViewers_AppUsers_ViewerId",
                        column: x => x.ViewerId,
                        principalTable: "AppUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BroadcasterViewers_BroadcasterId",
                table: "BroadcasterViewers",
                column: "BroadcasterId");

            migrationBuilder.CreateIndex(
                name: "IX_BroadcasterViewers_ConnectionId_ViewerId_BroadcasterId",
                table: "BroadcasterViewers",
                columns: new[] { "ConnectionId", "ViewerId", "BroadcasterId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BroadcasterViewers_ViewerId",
                table: "BroadcasterViewers",
                column: "ViewerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BroadcasterViewers");
        }
    }
}
