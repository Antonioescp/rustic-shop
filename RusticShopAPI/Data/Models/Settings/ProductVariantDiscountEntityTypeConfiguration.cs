using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace RusticShopAPI.Data.Models.Settings
{
    public class ProductVariantDiscountEntityTypeConfiguration : IEntityTypeConfiguration<ProductVariantDiscount>
    {
        public void Configure(EntityTypeBuilder<ProductVariantDiscount> builder)
        {
            builder.ToTable("ProductVariantDiscounts");

            builder.HasKey(pvd => pvd.Id);

            builder
                .Property(pvd => pvd.StartDate)
                .IsRequired();

            builder
                .Property(pvd => pvd.EndDate)
                .IsRequired();

            builder
                .Property(pvd => pvd.Percentage)
                .HasColumnType("DECIMAL(3,2)")
                .IsRequired();

            builder
                .HasCheckConstraint(
                    "CK_ProductVariantDiscounts_Percentage_Range",
                    "[Percentage] >= 0.01 AND [Percentage] <= 1.00");

            builder
                .HasCheckConstraint(
                    "CK_ProductVariantDiscounts_EndDate_Range",
                    "[EndDate] > [StartDate]");
        }
    }
}
