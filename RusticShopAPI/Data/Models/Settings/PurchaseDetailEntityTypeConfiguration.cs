using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace RusticShopAPI.Data.Models.Settings
{
    public class PurchaseDetailEntityTypeConfiguration : IEntityTypeConfiguration<PurchaseDetail>
    {
        public void Configure(EntityTypeBuilder<PurchaseDetail> builder)
        {
            builder.ToTable("PurchaseDetails");

            builder.HasKey(pd => pd.Id);

            builder
                .Property(pd => pd.Quantity)
                .IsRequired();

            builder
                .Property(pd => pd.UnitPrice)
                .IsRequired();

            builder
                .HasCheckConstraint(
                    "CK_PurchaseDetails_Quantity_Range",
                    "[Quantity] >= 1");
                
        }
    }
}
