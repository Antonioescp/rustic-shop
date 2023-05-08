using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace RusticShopAPI.Data.Models.Settings
{
    public class ProductEntityTypeConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.ToTable("Products");
            builder.HasKey(p => p.Id);
            builder
                .Property(p => p.Name)
                .IsRequired();
            builder
                .Property(p => p.ShortDescription)
                .IsRequired();
            builder
                .Property(p => p.IsPublished)
                .IsRequired()
                .HasDefaultValue(false);

            // Relationships
            builder
                .HasMany(p => p.Variants)
                .WithOne(pv => pv.Product);
        }
    }
}
