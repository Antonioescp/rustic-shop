using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RusticShopAPI.Data.Models;
using RusticShopAPI.Data.Models.Settings;
using RusticShopAPI.Data.Models.Views;

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

            // Applying all settings in assembly (Data/Models/Settings)
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

                userBuilder
                    .HasMany(u => u.PaymentMethods)
                    .WithOne(pm => pm.CardHolder)
                    .HasForeignKey(pm => pm.CardHolderId);
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
        public DbSet<ProductImage> ProductImages => Set<ProductImage>();
        public DbSet<ProductVariantImage> ProductVariantImages => Set<ProductVariantImage>();
        public DbSet<PaymentMethod> PaymentMethods => Set<PaymentMethod>();
        public DbSet<ProductVariantDiscount> ProductVariantDiscounts => Set<ProductVariantDiscount>();
        public DbSet<Provider> Providers => Set<Provider>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderDetail> OrderDetails => Set<OrderDetail>();
        public DbSet<Purchase> Purchases => Set<Purchase>();
        public DbSet<PurchaseDetail> PurchaseDetails => Set<PurchaseDetail>();
        public DbSet<Refund> Refunds => Set<Refund>();
        public DbSet<RefundDetail> RefundDetails => Set<RefundDetail>();
        public DbSet<ProductAttribute> ProductAttributes => Set<ProductAttribute>();
        public DbSet<CategoryProduct> CategoryProducts => Set<CategoryProduct>();
        public DbSet<ProductSales> ProductSales => Set<ProductSales>(); 
    }
}
