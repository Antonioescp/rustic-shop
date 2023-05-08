

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
        }

        public DbSet<City> Cities => Set<City>();
        public DbSet<Neighborhood> Neighborhoods => Set<Neighborhood>();
    }
}
