using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RS1_2024_25.API.Migrations
{
    /// <inheritdoc />
    public partial class notificationspreference : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MyAppUserPreferences",
                columns: table => new
                {
                    MyAppUserId = table.Column<int>(type: "int", nullable: false),
                    AllowPushNotifications = table.Column<bool>(type: "bit", nullable: false),
                    AllowEmailNotifications = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MyAppUserPreferences", x => x.MyAppUserId);
                    table.ForeignKey(
                        name: "FK_MyAppUserPreferences_MyAppUsers_MyAppUserId",
                        column: x => x.MyAppUserId,
                        principalTable: "MyAppUsers",
                        principalColumn: "ID");
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MyAppUserPreferences");
        }
    }
}
