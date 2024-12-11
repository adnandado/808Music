using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RS1_2024_25.API.Migrations
{
    /// <inheritdoc />
    public partial class MyUserArtistInvite : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MyUserArtistInvites",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Token = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExpiryDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RoleId = table.Column<int>(type: "int", nullable: false),
                    ArtistId = table.Column<int>(type: "int", nullable: false),
                    MyAppUserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MyUserArtistInvites", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MyUserArtistInvites_Artists_ArtistId",
                        column: x => x.ArtistId,
                        principalTable: "Artists",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_MyUserArtistInvites_MyAppUsers_MyAppUserId",
                        column: x => x.MyAppUserId,
                        principalTable: "MyAppUsers",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_MyUserArtistInvites_UserArtistRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "UserArtistRoles",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_MyUserArtistInvites_ArtistId",
                table: "MyUserArtistInvites",
                column: "ArtistId");

            migrationBuilder.CreateIndex(
                name: "IX_MyUserArtistInvites_MyAppUserId",
                table: "MyUserArtistInvites",
                column: "MyAppUserId");

            migrationBuilder.CreateIndex(
                name: "IX_MyUserArtistInvites_RoleId",
                table: "MyUserArtistInvites",
                column: "RoleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MyUserArtistInvites");
        }
    }
}
