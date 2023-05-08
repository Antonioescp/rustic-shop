using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace RusticShopAPI.Data.Models.Settings
{
    public class OrderDetailEntityTypeConfiguration : IEntityTypeConfiguration<OrderDetail>
    {
        public void Configure(EntityTypeBuilder<OrderDetail> builder)
        {
            builder.ToTable("OrderDetails");

            builder.HasKey(od => od.Id);

            builder
                .Property(od => od.Quantity)
                .IsRequired();

            builder
                .Property(od => od.UnitPrice)
                .IsRequired()
                .HasColumnType("MONEY");

            // Constraints
            builder
                .HasCheckConstraint(
                    "CK_OrderDetails_Quantity_Range",
                    "[Quantity] >= 1")
                .HasCheckConstraint(
                    "CK_OrderDetails_UnitPrice_Range",
                    "[UnitPrice] > 0");
        }
    }
}
