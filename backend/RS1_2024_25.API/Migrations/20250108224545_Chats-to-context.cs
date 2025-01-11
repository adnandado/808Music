using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RS1_2024_25.API.Migrations
{
    /// <inheritdoc />
    public partial class Chatstocontext : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserChats",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PrimaryChatterId = table.Column<int>(type: "int", nullable: false),
                    SecondaryChatterId = table.Column<int>(type: "int", nullable: false),
                    Muted = table.Column<bool>(type: "bit", nullable: false),
                    Blocked = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserChats", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserChats_MyAppUsers_PrimaryChatterId",
                        column: x => x.PrimaryChatterId,
                        principalTable: "MyAppUsers",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_UserChats_MyAppUsers_SecondaryChatterId",
                        column: x => x.SecondaryChatterId,
                        principalTable: "MyAppUsers",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "ChatMessages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserChatId = table.Column<int>(type: "int", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContentId = table.Column<int>(type: "int", nullable: false),
                    ContentType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SenderId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatMessages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChatMessages_MyAppUsers_SenderId",
                        column: x => x.SenderId,
                        principalTable: "MyAppUsers",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_ChatMessages_UserChats_UserChatId",
                        column: x => x.UserChatId,
                        principalTable: "UserChats",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_SenderId",
                table: "ChatMessages",
                column: "SenderId");

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_UserChatId",
                table: "ChatMessages",
                column: "UserChatId");

            migrationBuilder.CreateIndex(
                name: "IX_UserChats_PrimaryChatterId",
                table: "UserChats",
                column: "PrimaryChatterId");

            migrationBuilder.CreateIndex(
                name: "IX_UserChats_SecondaryChatterId",
                table: "UserChats",
                column: "SecondaryChatterId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChatMessages");

            migrationBuilder.DropTable(
                name: "UserChats");
        }
    }
}
