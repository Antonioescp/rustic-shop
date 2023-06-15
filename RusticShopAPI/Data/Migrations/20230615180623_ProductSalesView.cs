using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RusticShopAPI.Data.Migrations
{
    public partial class ProductSalesView : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
			@"CREATE VIEW [dbo].[VW_ProductSales]
			AS
			SELECT
				b.Name AS [BrandName],
				p.Name AS [ProductName],
				(
					SELECT COALESCE(SUM(pd.Quantity), 0)
					FROM PurchaseDetails pd
					INNER JOIN ProductVariants pv ON pv.Id = pd.ProductVariantId
					WHERE pv.ProductId = p.Id
				) AS [Purchases],
				(
					SELECT COALESCE(SUM(pd.Quantity * pd.UnitPrice), 0)
					FROM PurchaseDetails pd
					INNER JOIN ProductVariants pv ON pv.Id = pd.ProductVariantId
					WHERE pv.ProductId = p.Id
				) AS [Costs],
				(
					SELECT COALESCE(SUM(od.Quantity), 0)
					FROM OrderDetails od
					INNER JOIN ProductVariants pv ON pv.Id = od.ProductVariantId
					WHERE pv.ProductId = p.Id
				) AS [Sales],
				(
					SELECT COALESCE(SUM(od.Quantity * od.UnitPrice), 0)
					FROM OrderDetails od
					INNER JOIN ProductVariants pv ON pv.Id = od.ProductVariantId
					WHERE pv.ProductId = p.Id
				) AS [Incomes],
				(
					SELECT COALESCE(SUM(od.Quantity * od.UnitPrice), 0)
					FROM OrderDetails od
					INNER JOIN ProductVariants pv ON pv.Id = od.ProductVariantId
					WHERE pv.ProductId = p.Id
				) 
				- (
					SELECT COALESCE(SUM(pd.Quantity * pd.UnitPrice), 0)
					FROM PurchaseDetails pd
					INNER JOIN ProductVariants pv ON pv.Id = pd.ProductVariantId
					WHERE pv.ProductId = p.Id
				) AS [Profit]
			FROM Products p
			INNER JOIN Brands b ON b.Id = p.BrandId
			GROUP BY p.Name, p.Id, b.Name;
			GO");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
			migrationBuilder.Sql(@"DROP VIEW [dbo].[VW_ProductSales]");
        }
    }
}
