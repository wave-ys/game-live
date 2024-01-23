using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GameLiveServer.Migrations
{
    /// <inheritdoc />
    public partial class AddChatSettingsToStream : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ChatEnabled",
                table: "LiveStreams",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ChatFollowersOnly",
                table: "LiveStreams",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChatEnabled",
                table: "LiveStreams");

            migrationBuilder.DropColumn(
                name: "ChatFollowersOnly",
                table: "LiveStreams");
        }
    }
}
