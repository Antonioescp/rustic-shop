

using Microsoft.EntityFrameworkCore;
using RusticShopAPI.Data.Models;

namespace RusticShopAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) 
            : base(options) 
        {
        
        }

        public DbSet<User> Users { get; set; } = null!;
    }
}
