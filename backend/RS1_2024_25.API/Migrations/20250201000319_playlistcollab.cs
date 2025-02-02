using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RS1_2024_25.API.Migrations
{
    /// <inheritdoc />
    public partial class playlistcollab : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsOwner",
                table: "UserPlaylist",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "AddedByUserId",
                table: "PlaylistTracks",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsCollaborative",
                table: "Playlists",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_PlaylistTracks_AddedByUserId",
                table: "PlaylistTracks",
                column: "AddedByUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_PlaylistTracks_MyAppUsers_AddedByUserId",
                table: "PlaylistTracks",
                column: "AddedByUserId",
                principalTable: "MyAppUsers",
                principalColumn: "ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PlaylistTracks_MyAppUsers_AddedByUserId",
                table: "PlaylistTracks");

            migrationBuilder.DropIndex(
                name: "IX_PlaylistTracks_AddedByUserId",
                table: "PlaylistTracks");

            migrationBuilder.DropColumn(
                name: "IsOwner",
                table: "UserPlaylist");

            migrationBuilder.DropColumn(
                name: "AddedByUserId",
                table: "PlaylistTracks");

            migrationBuilder.DropColumn(
                name: "IsCollaborative",
                table: "Playlists");
        }
    }
}
