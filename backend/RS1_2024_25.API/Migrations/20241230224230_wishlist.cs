using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RS1_2024_25.API.Migrations
{
    /// <inheritdoc />
    public partial class wishlist : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserProductWishlist",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProductWishlist", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserProductWishlist_MyAppUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "MyAppUsers",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_UserProductWishlist_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserProductWishlist_ProductId",
                table: "UserProductWishlist",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_UserProductWishlist_UserId",
                table: "UserProductWishlist",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserProductWishlist");
        }
    }
}
