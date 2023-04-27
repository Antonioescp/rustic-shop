using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RusticShopAPI.Data.Migrations
{
    public partial class ProductListView : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
			migrationBuilder.Sql(@"CREATE VIEW VProductList
				AS
				SELECT 
					p.Id,
					p.Name,
					p.ShortDescription,
					p.Description,
					p.UnitPrice,
					(
						SELECT STRING_AGG(c.Name, ',') FROM Categories c
						JOIN CategoryProduct cp ON cp.CategoriesId = c.Id
						WHERE cp.ProductsId = p.Id
					) AS Categories,
					(
						SELECT STRING_AGG(CONCAT_WS(':', f.Name, fp.Content), ';') FROM Features f
						JOIN FeatureProducts fp ON fp.FeatureId = f.Id
						WHERE fp.ProductId = p.Id
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
			migrationBuilder.Sql(@"DROP VIEW VProductList");
        }
    }
}
