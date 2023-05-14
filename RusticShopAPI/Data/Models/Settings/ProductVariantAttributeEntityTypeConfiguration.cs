using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace RusticShopAPI.Data.Models.Settings
{
    public class ProductVariantAttributeEntityTypeConfiguration : IEntityTypeConfiguration<ProductVariantAttribute>
    {
        public void Configure(EntityTypeBuilder<ProductVariantAttribute> builder)
        {
            builder.ToTable("ProductVariantAttributes");

            builder.HasKey(pva => pva.Id);

            builder
                .Property(pva => pva.Value)
                .IsRequired();

            // Checks
            builder
                .HasCheckConstraint(
                    "CHK_ProductVariantAttribute_IsValidAttribute",
                    @"[dbo].IsValidProductVariantAttribute(ProductVariantId, AttributeId) = 1");
        }
    }
}
