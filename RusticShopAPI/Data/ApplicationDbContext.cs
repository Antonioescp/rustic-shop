

using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Cms;
using RusticShopAPI.Data.Models;
using RusticShopAPI.Data.Models.Settings;

namespace RusticShopAPI.Data
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions options)
            : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Applying all settings in assembly
            builder.ApplyConfigurationsFromAssembly(typeof(CityEntityTypeConfiguration).Assembly);

            // Relationships
            builder.Entity<User>(userBuilder =>
            {
                userBuilder
                    .HasMany(u => u.Addresses)
                    .WithOne(a => a.User);

                userBuilder
                    .HasMany(u => u.CartProducts)
                    .WithMany(p => p.CartUsers)
                    .UsingEntity<Cart>();

                userBuilder
                    .HasMany(u => u.WishlistedProducts)
                    .WithMany(p => p.WishlistedByUsers)
                    .UsingEntity<Wishlist>();
            });
        }

        public DbSet<City> Cities => Set<City>();
        public DbSet<Neighborhood> Neighborhoods => Set<Neighborhood>();
        public DbSet<Address> Addresses => Set<Address>();
        public DbSet<Brand> Brands => Set<Brand>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Discount> Discounts => Set<Discount>();
        public DbSet<Product> Products => Set<Product>();
        public DbSet<ProductVariant> ProductVariants => Set<ProductVariant>();
        public DbSet<Models.Attribute> Attributes => Set<Models.Attribute>();
        public DbSet<ProductVariantAttribute> ProductVariantAttributes => Set<ProductVariantAttribute>();
        public DbSet<Cart> Carts => Set<Cart>();
        public DbSet<Wishlist> Wishlists => Set<Wishlist>();
    }
}
