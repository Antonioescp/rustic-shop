using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace RusticShopAPI.Data.Models.Settings
{
    public class RefundEntityTypeConfiguration : IEntityTypeConfiguration<Refund>
    {
        public void Configure(EntityTypeBuilder<Refund> builder)
        {
            builder.ToTable("Refunds");

            builder.HasKey(r => r.Id);

            builder
                .Property(r => r.Reason)
                .HasColumnType("TEXT")
                .IsRequired();

            builder
                .Property(r => r.Date)
                .IsRequired();

            // Relationships
            builder
                .HasOne(r => r.User)
                .WithMany(u => u.Refunds);

            builder
                .HasOne(r => r.Order)
                .WithMany(o => o.Refunds);

            builder
                .HasMany(r => r.RefundedProducts)
                .WithMany(pv => pv.Refunds)
                .UsingEntity<RefundDetail>();
        }
    }
}
