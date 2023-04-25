using RusticShopAPI.Data.Models.Users;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RusticShopAPI.Data.Models
{
    [Table("Carts")]
    public class Cart
    {
        [Required]
        [ForeignKey(nameof(User))]
        public string UserId { get; set; } = null!;

        [Required]
        [ForeignKey(nameof(Product))]
        public long ProductId { get; set; }

        [Required]
        public int Quantity { get; set; }

        // Navigations
        public User? User { get; set; } = null!;
        public Product? Product { get; set; } = null!;
    }
}
