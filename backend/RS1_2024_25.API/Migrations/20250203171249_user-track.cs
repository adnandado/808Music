using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RS1_2024_25.API.Migrations
{
    /// <inheritdoc />
    public partial class usertrack : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "TrackStream",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TrackStream_UserId",
                table: "TrackStream",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_TrackStream_MyAppUsers_UserId",
                table: "TrackStream",
                column: "UserId",
                principalTable: "MyAppUsers",
                principalColumn: "ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TrackStream_MyAppUsers_UserId",
                table: "TrackStream");

            migrationBuilder.DropIndex(
                name: "IX_TrackStream_UserId",
                table: "TrackStream");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "TrackStream");
        }
    }
}
