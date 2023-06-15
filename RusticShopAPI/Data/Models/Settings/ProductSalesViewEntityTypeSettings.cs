using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RusticShopAPI.Data.Models.Views;

namespace RusticShopAPI.Data.Models.Settings
{
    public class ProductSalesViewEntityTypeSettings : IEntityTypeConfiguration<ProductSales>
    {
        public void Configure(EntityTypeBuilder<ProductSales> builder)
        {
            builder
                .ToView($"VW_{nameof(ProductSales)}")
                .HasNoKey();
        }
    }
}
