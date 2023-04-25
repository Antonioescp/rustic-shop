using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RusticShopAPI.Data.Models
{
    public class Sale
    {
        [Required]
        [Key]
        [ForeignKey(nameof(Transaction))]
        public long Id { get; set; }

        [ForeignKey(nameof(BankCard))]
        public long BankCardId { get; set; }

        // Navigations
        public Transaction? Transaction { get; set; } = null!;
        public BankCard? BankCard { get; set; } = null!;
    }
}
