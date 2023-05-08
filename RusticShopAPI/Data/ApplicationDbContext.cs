

using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RusticShopAPI.Data.Converters;
using RusticShopAPI.Data.Models;
using RusticShopAPI.Data.Models.Users;
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

            builder.Entity<User>()
                .HasMany(u => u.Wishlist)
                .WithMany(p => p.Wishlists)
                .UsingEntity<Wishlist>();

            builder.Entity<User>()
                .HasMany(u => u.Cart)
                .WithMany(p => p.Carts)
                .UsingEntity<Cart>();

            builder.Entity<Discount>()
                .HasMany(d => d.Products)
                .WithMany(p => p.Discounts)
                .UsingEntity<DiscountProduct>();

            builder.Entity<Product>()
                .HasMany(p => p.Features)
                .WithMany(f => f.Products)
                .UsingEntity<FeatureProduct>();

            builder.Entity<Transaction>()
                .HasMany(t => t.Products)
                .WithMany(p => p.Transactions)
                .UsingEntity<ProductTransaction>();

            // Adding converters
            builder.Entity<BankCard>()
                .Property(x => x.ExpirationDate)
                .HasConversion<DateOnlyConverter, DateOnlyComparer>();

            // Adding views
            builder.Entity<VProductSummary>()
                .ToView(nameof(VProductSummary))
                .HasKey(x => x.Id);

            // Adding extra constraints
            builder.Entity<Category>(b =>
            {
                b.HasIndex(b => b.Name).IsUnique();
            });

            builder.Entity<Feature>(b =>
            {
                b.HasIndex(f => f.Name).IsUnique();
            });

            // Brand settings
            builder.Entity<Brand>(b =>
            {
                b.HasIndex(brand => brand.Name).IsUnique();
            });
        }

        public DbSet<FeatureProduct> FeatureProducts => Set<FeatureProduct>();
        public DbSet<Feature> Features => Set<Feature>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Product> Products => Set<Product>();  
        public DbSet<ProductImage> ProductImages => Set<ProductImage>();
        public DbSet<Discount> Discounts => Set<Discount>();
        public DbSet<DiscountProduct> DiscountProducts => Set<DiscountProduct>();
        public DbSet<Wishlist> Wishlists => Set<Wishlist>();
        public DbSet<Cart> Carts => Set<Cart>();
        public DbSet<Brand> Brands => Set<Brand>();

        // Views
        public DbSet<VProductSummary> ProductListView => Set<VProductSummary>();
    }
}
