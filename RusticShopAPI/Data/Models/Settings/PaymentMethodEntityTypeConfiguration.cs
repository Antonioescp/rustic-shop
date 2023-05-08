using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace RusticShopAPI.Data.Models.Settings
{
    public class PaymentMethodEntityTypeConfiguration : IEntityTypeConfiguration<PaymentMethod>
    {
        public void Configure(EntityTypeBuilder<PaymentMethod> builder)
        {
            builder.ToTable("PaymentMethods");

            builder.HasKey(pm => pm.Id);

            builder
                .Property(pm => pm.NameOnCard)
                .IsRequired();

            builder
                .Property(pm => pm.PAN)
                .IsRequired()
                .HasMaxLength(16);

            builder
                .Property(pm => pm.ExpirationDate)
                .IsRequired();
        }
    }
}
