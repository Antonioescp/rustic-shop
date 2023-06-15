using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RusticShopAPI.Data.Migrations
{
    public partial class ProgrammerRole : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(string.Format(
                "INSERT INTO AspNetRoles (Id, Name, NormalizedName, ConcurrencyStamp)" +
                "VALUES ('{0}', 'Programmer', 'PROGRAMMER', '{1}')",
                Guid.NewGuid(), Guid.NewGuid()));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                "DELETE FROM AspNetRoles WHERE Name = 'Programmer'");
        }
    }
}
