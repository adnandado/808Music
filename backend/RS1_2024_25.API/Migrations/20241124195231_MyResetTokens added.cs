using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RS1_2024_25.API.Migrations
{
    /// <inheritdoc />
    public partial class MyResetTokensadded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MyResetTokens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ResetToken = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExpiryTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MyAppUserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MyResetTokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MyResetTokens_MyAppUsers_MyAppUserId",
                        column: x => x.MyAppUserId,
                        principalTable: "MyAppUsers",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_MyResetTokens_MyAppUserId",
                table: "MyResetTokens",
                column: "MyAppUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MyResetTokens");
        }
    }
}
