using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RusticShopAPI.Data.Models
{
    public class ProductTransaction
    {
        [Required]
        [ForeignKey(nameof(Product))]
        public long ProductId { get; set; }

        [Required]
        [ForeignKey(nameof(Transaction))]
        public long TransactionId { get; set; }

        [Required]
        [Column(TypeName = "MONEY")]
        public decimal UnitPrice { get; set; }

        [Required]
        [Range(1, long.MaxValue)]
        public long Quantity { get; set; }

        // Navigations
        public Product? Product { get; set; } = null!;
        public Transaction? Transaction { get; set; } = null!;
    }
}
