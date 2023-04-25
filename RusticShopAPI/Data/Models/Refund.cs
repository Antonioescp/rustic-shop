using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RusticShopAPI.Data.Models
{
    public class Refund
    {
        [Required]
        [Key]
        [ForeignKey(nameof(Transaction))]
        public long Id { get; set; }

        [Required]
        [ForeignKey(nameof(BankCard))]
        public long BankCardId { get; set; }

        [Required]
        [Column(TypeName = "TEXT")]
        public string Reason { get; set; } = null!;

        // Navigations
        public Transaction? Transaction { get; set; } = null!;
        public BankCard? BankCard { get; set; } = null!;
    }
}
