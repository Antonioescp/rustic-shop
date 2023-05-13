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

            builder
                .Ignore(p => p.Stock);

            // Relationships
            builder
                .HasMany(p => p.Variants)
                .WithOne(pv => pv.Product);

            builder
                .HasMany(p => p.Images)
                .WithOne(pi => pi.Product);
        }
    }
}
