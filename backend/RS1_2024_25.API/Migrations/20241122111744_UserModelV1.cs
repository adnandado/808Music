using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RS1_2024_25.API.Migrations
{
    /// <inheritdoc />
    public partial class UserModelV1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CountryId",
                table: "MyAppUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateOfBirth",
                table: "MyAppUsers",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "MyAppUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "MyAppUsers",
                type: "bit",
                nullable: false,
                defaultValue: false);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DropColumn(
                name: "DateOfBirth",
                table: "MyAppUsers");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "MyAppUsers");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "MyAppUsers");
        }
    }
}
