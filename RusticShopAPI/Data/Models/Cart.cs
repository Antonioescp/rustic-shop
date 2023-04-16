using RusticShopAPI.Data.Models.Users;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RusticShopAPI.Data.Models
{
    [Table("Carts")]
    public class Cart
    {
        [Required]
        [Key]
        public long Id { get; set; }

        [Required]
        [ForeignKey(nameof(User))]
        public string UserId { get; set; } = null!;

        // Navigations
        public User User { get; set; } = null!;
        public List<Product> Products { get; } = new();
        public List<CartProduct> CartProducts { get; } = new();
    }
}
