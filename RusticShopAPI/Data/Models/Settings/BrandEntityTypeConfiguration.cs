using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace RusticShopAPI.Data.Models.Settings
{
    public class BrandEntityTypeConfiguration : IEntityTypeConfiguration<Brand>
    {
        public void Configure(EntityTypeBuilder<Brand> builder)
        {
            builder.ToTable("Brands");
            builder.HasKey("Id");
            builder.Property(b => b.Name).IsRequired();
            builder.HasIndex(b => b.Name).IsUnique();

            // Relationships
            builder
                .HasMany(b => b.Products)
                .WithOne(p => p.Brand);
        }
    }
}
