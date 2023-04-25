using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RusticShopAPI.Data.Models
{
    public class Purchase
    {
        [Required]
        [Key]
        [ForeignKey(nameof(Transaction))]
        public long Id { get; set; }

        [Required]
        [ForeignKey(nameof(Provider))]
        public long ProviderId { get; set; }

        // Navigations
        public Transaction? Transaction { get; set; } = null!;
        public Provider? Provider { get; set; } = null!;
    }
}
