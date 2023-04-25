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
        [ForeignKey(nameof(User))]
        public string UserId { get; set; } = null!;

        [Required]
        [ForeignKey(nameof(Product))]
        public long ProductId { get; set; }

        // Navigation Properties
        public User? User { get; set; } = null!;
        public Product? Product { get; set; } = null!;
    }
}
