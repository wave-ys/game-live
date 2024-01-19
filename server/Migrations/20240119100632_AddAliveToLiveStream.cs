using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GameLiveServer.Migrations
{
    /// <inheritdoc />
    public partial class AddAliveToLiveStream : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Alive",
                table: "LiveStreams",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Alive",
                table: "LiveStreams");
        }
    }
}
