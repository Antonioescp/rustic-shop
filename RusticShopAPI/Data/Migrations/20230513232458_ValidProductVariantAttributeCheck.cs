using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RusticShopAPI.Data.Migrations
{
    public partial class ValidProductVariantAttributeCheck : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Adding function to perform the check 
            migrationBuilder.Sql("CREATE FUNCTION [dbo].IsValidProductVariantAttribute(" +
                "@ProductVariantId BIGINT, @AttributeId BIGINT)\n" +
                "RETURNS BIT\n" +
                "AS BEGIN\n" +
                "   DECLARE @Result BIT;\n" +
                "   DECLARE @ProductId BIGINT;\n" +
                "\n" +
                "   SELECT @ProductId = ProductId\n" +
                "   FROM ProductVariants\n" +
                "   WHERE Id = @ProductVariantId;\n" +
                "" +
                "   IF @ProductId IN (\n" +
                "       SELECT ProductId\n" +
                "       FROM ProductAttributes\n" +
                "       WHERE AttributeId = @AttributeId)\n" +
                "       SET @Result = 1;\n" +
                "   ELSE\n" +
                "       SET @Result = 0;\n" +
                "\n" +
                "   RETURN @Result;\n" +
                "END;");

            migrationBuilder.AddCheckConstraint(
                name: "CHK_ProductVariantAttribute_IsValidAttribute",
                table: "ProductVariantAttributes",
                sql: "[dbo].IsValidProductVariantAttribute(ProductVariantId,AttributeId)=1");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CHK_ProductVariantAttribute_IsValidAttribute",
                table: "ProductVariantAttributes");

            // Dropping function
            migrationBuilder.Sql(@"DROP FUNCTION [dbo].IsValidProductVariantAttribute;");
        }
    }
}
