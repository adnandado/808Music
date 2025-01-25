using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RS1_2024_25.API.Migrations
{
    /// <inheritdoc />
    public partial class Spotlightpkfix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_AlbumSpotlights",
                table: "AlbumSpotlights");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AlbumSpotlights",
                table: "AlbumSpotlights",
                column: "ArtistId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_AlbumSpotlights",
                table: "AlbumSpotlights");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AlbumSpotlights",
                table: "AlbumSpotlights",
                columns: new[] { "ArtistId", "AlbumId" });
        }
    }
}
