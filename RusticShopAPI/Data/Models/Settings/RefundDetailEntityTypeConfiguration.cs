using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace RusticShopAPI.Data.Models.Settings
{
    public class RefundDetailEntityTypeConfiguration : IEntityTypeConfiguration<RefundDetail>
    {
        public void Configure(EntityTypeBuilder<RefundDetail> builder)
        {
            builder.ToTable("RefundDetails");

            builder.HasKey(rd => rd.Id);

            builder
                .Property(rd => rd.Quantity)
                .IsRequired();

            // Constraints
            builder
                .HasCheckConstraint(
                    "CK_RefundDetails_Quantity_Range",
                    "[Quantity] > 0");
        }
    }
}
