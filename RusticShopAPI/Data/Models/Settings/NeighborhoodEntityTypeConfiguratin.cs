using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace RusticShopAPI.Data.Models.Settings
{
    public class NeighborhoodEntityTypeConfiguration : IEntityTypeConfiguration<Neighborhood>
    {
        public void Configure(EntityTypeBuilder<Neighborhood> builder)
        {
            builder.ToTable("Neighborhoods");
            builder.HasKey(n => n.Id);
            builder.Property(n => n.Name).IsRequired();
        }
    }
}
