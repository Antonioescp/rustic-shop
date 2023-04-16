using RusticShopAPI.Data.Models.Users;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RusticShopAPI.Data.Models
{
    [Table("Wishlists")]
    public class Wishlist
    {
        [Required]
        [Key]
        public long Id { get; set; }

        [Required]
        [ForeignKey(nameof(User))]
        public string UserId { get; set; } = null!;

        // Navigations
        public List<Product> Products { get; } = new();
        public User User { get; set; } = null!;
    }
}
