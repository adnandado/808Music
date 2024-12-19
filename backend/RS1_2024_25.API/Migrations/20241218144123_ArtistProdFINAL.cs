using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RS1_2024_25.API.Migrations
{
    /// <inheritdoc />
    public partial class ArtistProdFINAL : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ArtistId",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Products_ArtistId",
                table: "Products",
                column: "ArtistId");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Artists_ArtistId",
                table: "Products",
                column: "ArtistId",
                principalTable: "Artists",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Artists_ArtistId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_ArtistId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ArtistId",
                table: "Products");
        }
    }
}
