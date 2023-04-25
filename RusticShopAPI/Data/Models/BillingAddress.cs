using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RusticShopAPI.Data.Models
{
    public class BillingAddress
    {
        [Required]
        [Key]
        [ForeignKey(nameof(Address))]
        public long Id { get; set; }

        // Navigations
        public Address? Address { get; set; } = null!;
    }
}
