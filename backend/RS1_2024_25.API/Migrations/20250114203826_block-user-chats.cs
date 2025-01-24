using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RS1_2024_25.API.Migrations
{
    /// <inheritdoc />
    public partial class blockuserchats : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BlockedByUserId",
                table: "UserChats",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserChats_BlockedByUserId",
                table: "UserChats",
                column: "BlockedByUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserChats_MyAppUsers_BlockedByUserId",
                table: "UserChats",
                column: "BlockedByUserId",
                principalTable: "MyAppUsers",
                principalColumn: "ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserChats_MyAppUsers_BlockedByUserId",
                table: "UserChats");

            migrationBuilder.DropIndex(
                name: "IX_UserChats_BlockedByUserId",
                table: "UserChats");

            migrationBuilder.DropColumn(
                name: "BlockedByUserId",
                table: "UserChats");
        }
    }
}
