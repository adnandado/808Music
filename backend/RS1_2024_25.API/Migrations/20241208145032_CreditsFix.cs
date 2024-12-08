using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RS1_2024_25.API.Migrations
{
    /// <inheritdoc />
    public partial class CreditsFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Credits",
                table: "Credits");

            migrationBuilder.DropIndex(
                name: "IX_Credits_TrackId",
                table: "Credits");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Credits");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Credits",
                table: "Credits",
                column: "TrackId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Credits",
                table: "Credits");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Credits",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Credits",
                table: "Credits",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Credits_TrackId",
                table: "Credits",
                column: "TrackId");
        }
    }
}
