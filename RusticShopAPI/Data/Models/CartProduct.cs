using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RusticShopAPI.Data.Models
{
    [Table("CartProducts")]
    public class CartProduct
    {
        public long Id { get; set; }

        [Required]
        [ForeignKey(nameof(Cart))]
        public long CartId { get; set; }

        [Required]
        [ForeignKey(nameof(Product))]
        public long ProductId { get; set; }

        [Required]
        public int Quantity { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigations
        public Cart Cart { get; set; } = null!;
        public Product Product { get; set; } = null!;
    }
}
