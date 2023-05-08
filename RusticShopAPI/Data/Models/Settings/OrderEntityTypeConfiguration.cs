using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace RusticShopAPI.Data.Models.Settings
{
    public class OrderEntityTypeConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.ToTable("Orders");

            builder.HasKey(o => o.Id);

            builder
                .Property(o => o.Status)
                .IsRequired();

            builder
                .Property(o => o.Date)
                .IsRequired();

            builder
                .Ignore(o => o.Total);

            // Relationships
            builder
                .HasOne(o => o.User)
                .WithMany(u => u.Orders)
                .OnDelete(DeleteBehavior.NoAction);

            builder
                .HasOne(o => o.PaymentMethod)
                .WithMany(pm => pm.Orders)
                .OnDelete(DeleteBehavior.NoAction);

            builder
                .HasOne(o => o.ShippingAddress)
                .WithMany(a => a.Orders)
                .HasForeignKey(o => o.ShippingAddressId)
                .OnDelete(DeleteBehavior.NoAction);

            builder
                .HasMany(o => o.ProductVariants)
                .WithMany(pv => pv.Orders)
                .UsingEntity<OrderDetail>();

        }
    }
}
