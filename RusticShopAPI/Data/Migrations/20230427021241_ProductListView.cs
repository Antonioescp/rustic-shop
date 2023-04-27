using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RusticShopAPI.Data.Migrations
{
    public partial class ProductListView : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
			migrationBuilder.Sql(@"CREATE VIEW VProductSummary
				AS
				SELECT 
					p.Id,
					p.Name,
					p.ShortDescription,
					p.UnitPrice,
					(
						SELECT STRING_AGG(c.Name, ',') FROM Categories c
						JOIN CategoryProduct cp ON cp.CategoriesId = c.Id
						WHERE cp.ProductsId = p.Id
					) AS Categories,
					(
						SELECT COUNT(fp.Content) FROM FeatureProducts fp WHERE fp.ProductId = p.Id
					) AS Features,
					(
						SELECT COUNT(pimg.Id) FROM ProductImage pimg WHERE pimg.ProductId = p.Id
					) AS ImagesCount,
					(
						SELECT COUNT(*) FROM DiscountProducts dp WHERE dp.ProductId = p.Id 
					) AS DiscountsCount,
					p.IsPublished AS IsPublished
				FROM Products p");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
			migrationBuilder.Sql(@"DROP VIEW VProductSummary");
        }
    }
}
