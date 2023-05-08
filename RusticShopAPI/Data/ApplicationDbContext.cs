

using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RusticShopAPI.Data.Converters;
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

            // Applying all settings in assembly
            builder.ApplyConfigurationsFromAssembly(typeof(CityEntityTypeConfiguration).Assembly);

            // Relationships
            builder.Entity<User>(b =>
            {
                b.HasMany(u => u.Addresses).WithOne(a => a.User);
            });
        }

        public DbSet<City> Cities => Set<City>();
        public DbSet<Neighborhood> Neighborhoods => Set<Neighborhood>();
        public DbSet<Address> Addresses => Set<Address>();
        public DbSet<Brand> Brands => Set<Brand>();
        public DbSet<Category> Categories => Set<Category>();

    }
}
