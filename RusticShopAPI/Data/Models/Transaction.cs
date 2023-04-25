using System.ComponentModel.DataAnnotations;

namespace RusticShopAPI.Data.Models
{
    public class Transaction
    {
        [Required]
        [Key]
        public long Id { get; set; }

        [Required]
        public DateTime TransactionDate { get; set; } = DateTime.UtcNow;

        // Navigations
        public Purchase? Purchase { get; set; } = null!;
        public Refund? Refund { get; set; } = null!;
        public Sale? Sale { get; set; } = null!;
        public ICollection<Product>? Products { get; set; } = null!;
        public ICollection<ProductTransaction> ProductTransactions { get; set; } = null!;
    }
}
