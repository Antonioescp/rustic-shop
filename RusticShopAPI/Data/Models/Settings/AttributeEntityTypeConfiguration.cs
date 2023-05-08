using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace RusticShopAPI.Data.Models.Settings
{
    public class AttributeEntityTypeConfiguration : IEntityTypeConfiguration<Attribute>
    {
        public void Configure(EntityTypeBuilder<Attribute> builder)
        {
            builder.ToTable("Attributes");

            builder.HasKey(att => att.Id);

            builder
                .Property(att => att.Name)
                .IsRequired();

            builder
                .HasIndex(att => att.Name)
                .IsUnique();

            // Relationships
            builder
                .HasMany(att => att.Products)
                .WithMany(p => p.Attributes)
                .UsingEntity<ProductAttribute>();
                
        }
    }
}
