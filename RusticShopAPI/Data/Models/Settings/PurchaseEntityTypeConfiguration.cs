using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace RusticShopAPI.Data.Models.Settings
{
    public class PurchaseEntityTypeConfiguration : IEntityTypeConfiguration<Purchase>
    {
        public void Configure(EntityTypeBuilder<Purchase> builder)
        {
            builder.ToTable("Purchases");

            builder.HasKey(p => p.Id);

            builder
                .Property(p => p.Date)
                .IsRequired();

            // Relationships
            builder
                .HasMany(p => p.ProductVariants)
                .WithMany(pv => pv.Purchases)
                .UsingEntity<PurchaseDetail>();

        }
    }
}
