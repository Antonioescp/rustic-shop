

using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RusticShopAPI.Data.Models;
using RusticShopAPI.Data.Models.Users;

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
        }

        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Product> Products => Set<Product>();  
        public DbSet<Feature> Features => Set<Feature>();
        public DbSet<ProductImage> ProductImages => Set<ProductImage>();
        public DbSet<Wishlist> Wishlists => Set<Wishlist>();
        public DbSet<Cart> Carts => Set<Cart>();
        public DbSet<Cart> CartProducts => Set<Cart>();
    }
}
