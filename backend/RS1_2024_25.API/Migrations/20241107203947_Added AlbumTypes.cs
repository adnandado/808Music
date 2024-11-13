using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RS1_2024_25.API.Migrations
{
    /// <inheritdoc />
    public partial class AddedAlbumTypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "Albums");

            migrationBuilder.AddColumn<int>(
                name: "AlbumTypeId",
                table: "Albums",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "AlbumTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlbumTypes", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Albums_AlbumTypeId",
                table: "Albums",
                column: "AlbumTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Albums_AlbumTypes_AlbumTypeId",
                table: "Albums",
                column: "AlbumTypeId",
                principalTable: "AlbumTypes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Albums_AlbumTypes_AlbumTypeId",
                table: "Albums");

            migrationBuilder.DropTable(
                name: "AlbumTypes");

            migrationBuilder.DropIndex(
                name: "IX_Albums_AlbumTypeId",
                table: "Albums");

            migrationBuilder.DropColumn(
                name: "AlbumTypeId",
                table: "Albums");

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Albums",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
