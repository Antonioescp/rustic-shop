using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace RusticShopAPI.Data.Models.Settings
{
    public class WishlistEntityTypeConfiguration : IEntityTypeConfiguration<Wishlist>
    {
        public void Configure(EntityTypeBuilder<Wishlist> builder)
        {
            builder.ToTable("Wishlists");
        }
    }
}
