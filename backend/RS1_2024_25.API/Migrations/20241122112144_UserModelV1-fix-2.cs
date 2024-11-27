using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RS1_2024_25.API.Migrations
{
    /// <inheritdoc />
    public partial class UserModelV1fix2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MyAppUsers_Countries_CountryId",
                table: "MyAppUsers");

            migrationBuilder.DropIndex(
                name: "IX_MyAppUsers_CountryId",
                table: "MyAppUsers");

            migrationBuilder.DropColumn(
                name: "CountryId",
                table: "MyAppUsers");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CountryId",
                table: "MyAppUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_MyAppUsers_CountryId",
                table: "MyAppUsers",
                column: "CountryId");

            migrationBuilder.AddForeignKey(
                name: "FK_MyAppUsers_Countries_CountryId",
                table: "MyAppUsers",
                column: "CountryId",
                principalTable: "Countries",
                principalColumn: "ID");
        }
    }
}
