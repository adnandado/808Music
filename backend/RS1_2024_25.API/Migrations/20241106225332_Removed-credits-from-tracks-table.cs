using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RS1_2024_25.API.Migrations
{
    /// <inheritdoc />
    public partial class Removedcreditsfromtrackstable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Album_Artists_ArtistId",
                table: "Album");

            migrationBuilder.DropForeignKey(
                name: "FK_Tracks_Album_AlbumId",
                table: "Tracks");

            migrationBuilder.DropForeignKey(
                name: "FK_Tracks_Credits_CreditsId",
                table: "Tracks");

            migrationBuilder.DropIndex(
                name: "IX_Tracks_CreditsId",
                table: "Tracks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Album",
                table: "Album");

            migrationBuilder.DropColumn(
                name: "CoverArt",
                table: "Tracks");

            migrationBuilder.DropColumn(
                name: "CreditsId",
                table: "Tracks");

            migrationBuilder.RenameTable(
                name: "Album",
                newName: "Albums");

            migrationBuilder.RenameIndex(
                name: "IX_Album_ArtistId",
                table: "Albums",
                newName: "IX_Albums_ArtistId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Albums",
                table: "Albums",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Albums_Artists_ArtistId",
                table: "Albums",
                column: "ArtistId",
                principalTable: "Artists",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Tracks_Albums_AlbumId",
                table: "Tracks",
                column: "AlbumId",
                principalTable: "Albums",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Albums_Artists_ArtistId",
                table: "Albums");

            migrationBuilder.DropForeignKey(
                name: "FK_Tracks_Albums_AlbumId",
                table: "Tracks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Albums",
                table: "Albums");

            migrationBuilder.RenameTable(
                name: "Albums",
                newName: "Album");

            migrationBuilder.RenameIndex(
                name: "IX_Albums_ArtistId",
                table: "Album",
                newName: "IX_Album_ArtistId");

            migrationBuilder.AddColumn<string>(
                name: "CoverArt",
                table: "Tracks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "CreditsId",
                table: "Tracks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Album",
                table: "Album",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Tracks_CreditsId",
                table: "Tracks",
                column: "CreditsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Album_Artists_ArtistId",
                table: "Album",
                column: "ArtistId",
                principalTable: "Artists",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Tracks_Album_AlbumId",
                table: "Tracks",
                column: "AlbumId",
                principalTable: "Album",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Tracks_Credits_CreditsId",
                table: "Tracks",
                column: "CreditsId",
                principalTable: "Credits",
                principalColumn: "Id");
        }
    }
}
