using Microsoft.AspNetCore.Identity;
using RusticShopAPI.Data.Models.Users;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RusticShopAPI.Data.Models
{
    public class BankCard
    {
        [Required]
        [Key]
        public long Id { get; set; }

        [Required]
        [ForeignKey(nameof(BillingAddress))]
        public long BillingAddressId { get; set; }

        [Required]
        public string NameOnCard { get; set; } = null!;

        [Required]
        [CreditCard]
        [ProtectedPersonalData]
        public string CardNumber { get; set; } = null!;

        [Required]
        [Column(TypeName = "DATE")]
        public DateOnly ExpirationDate { get; set; }

        // Navigations
        public BillingAddress? BillingAddress { get; set; } = null!;
        public User? CardHolder { get; set; } = null!;
    }
}
