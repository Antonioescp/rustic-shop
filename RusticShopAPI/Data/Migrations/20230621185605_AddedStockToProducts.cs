using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RusticShopAPI.Data.Migrations
{
    public partial class AddedStockToProducts : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "Stock",
                table: "ProductVariants",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Stock",
                table: "ProductVariants");
        }
    }
}
