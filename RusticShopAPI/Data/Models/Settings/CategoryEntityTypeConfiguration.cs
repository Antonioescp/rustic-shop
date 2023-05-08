using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace RusticShopAPI.Data.Models.Settings
{
    public class CategoryEntityTypeConfiguration : IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> builder)
        {
            builder.ToTable("Categories");

            builder.HasKey(cat => cat.Id);

            builder
                .HasIndex(cat => cat.Name)
                .IsUnique();

            builder
                .Property(cat => cat.Name)
                .IsRequired();

            // Relationships
            builder
                .HasMany(c => c.Products)
                .WithMany(p => p.Categories)
                .UsingEntity<CategoryProduct>();
        }
    }
}
