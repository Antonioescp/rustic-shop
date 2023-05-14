using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace RusticShopAPI.Data.Models.Settings
{
    public class ProductVariantEntityTypeConfiguration : IEntityTypeConfiguration<ProductVariant>
    {
        public void Configure(EntityTypeBuilder<ProductVariant> builder)
        {
            builder.ToTable("ProductVariants");
            builder.HasKey(pv => pv.Id);
            
            builder
                .HasIndex(pv => pv.SKU)
                .IsUnique();

            builder
                .Property(pv => pv.SKU)
                .IsRequired();

            builder
                .Property(pv => pv.UnitPrice)
                .HasColumnType("MONEY")
                .IsRequired();

            builder
                .Property(pv => pv.IsPublished)
                .HasDefaultValue(false)
                .IsRequired();

            builder
                .Ignore(pv => pv.Stock)
                .Ignore(pv => pv.CurrentDiscount)
                .Ignore(pv => pv.HasDiscount)
                .Ignore(pv => pv.WishlistedCount)
                .Ignore(pv => pv.DiscountedUnitPrice);

            // Relationships
            builder
                .HasMany(pv => pv.Attributes)
                .WithMany(pa => pa.ProductVariants)
                .UsingEntity<ProductVariantAttribute>();

            builder
                .HasMany(pv => pv.Images)
                .WithMany(pi => pi.ProductVariants)
                .UsingEntity<ProductVariantImage>();

            builder
                .HasMany(pv => pv.Discounts)
                .WithMany(d => d.ProductVariants)
                .UsingEntity<ProductVariantDiscount>();
                
        }
    }
}
