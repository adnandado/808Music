using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RS1_2024_25.API.Migrations
{
    /// <inheritdoc />
    public partial class followingi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FollowForUser",
                columns: table => new
                {
                    FollowerUserId = table.Column<int>(type: "int", nullable: false),
                    FollowedUserId = table.Column<int>(type: "int", nullable: false),
                    StartedFollowing = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FollowForUser", x => new { x.FollowerUserId, x.FollowedUserId });
                    table.ForeignKey(
                        name: "FK_FollowForUser_MyAppUsers_FollowedUserId",
                        column: x => x.FollowedUserId,
                        principalTable: "MyAppUsers",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_FollowForUser_MyAppUsers_FollowerUserId",
                        column: x => x.FollowerUserId,
                        principalTable: "MyAppUsers",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_FollowForUser_FollowedUserId",
                table: "FollowForUser",
                column: "FollowedUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FollowForUser");
        }
    }
}
