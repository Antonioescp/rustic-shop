using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace RusticShopAPI.Data.Models.Settings
{
    public class CartEntityTypeConfiguration : IEntityTypeConfiguration<Cart>
    {
        public void Configure(EntityTypeBuilder<Cart> builder)
        {
            builder.ToTable("Carts");

            builder
                .Property(c => c.Quantity)
                .IsRequired();

            builder
                .HasCheckConstraint("CK_Carts_Quantity_Range", "[Quantity] >= 1");
                
        }
    }
}
