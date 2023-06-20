using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RusticShopAPI.Data.Migrations
{
    public partial class DeleteProductVariantAttributesOnProductAttributesDeletion : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"USE [RusticShop]
                GO

                SET ANSI_NULLS ON
                GO

                SET QUOTED_IDENTIFIER ON
                GO

                CREATE TRIGGER [dbo].[TG_ProductAttributes_CleanVariants]
                ON [dbo].[ProductAttributes]
                FOR DELETE
                AS BEGIN
                    
                    DECLARE @ProductId AS BIGINT;
                    DECLARE @AttributeId AS BIGINT;

                    SELECT
                        @ProductId = ProductId,
                        @AttributeId = AttributeId
                    FROM
                        deleted;

                    DELETE pva FROM [dbo].[ProductVariantAttributes] AS pva
                        INNER JOIN Products AS p ON p.Id = @ProductId
                    WHERE p.Id = @ProductId AND pva.AttributeId = @AttributeId;

                END;
                GO

                ALTER TABLE [dbo].[ProductAttributes] ENABLE TRIGGER [TG_ProductAttributes_CleanVariants]
                GO");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DROP TRIGGER [dbo].[TG_ProductAttributes_CleanVariants];");
        }
    }
}
