using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace RusticShopAPI.Data.Models.Users
{
    public class User : IdentityUser
    {
        // IdentityUser already has an Id, a Phone Number, an Email and a password hash
        [ProtectedPersonalData]
        public string? IdentificationCardNumber { get; set; }
        [PersonalData]
        public string? FirstName { get; set; }
        [PersonalData]
        public string? LastName { get; set; }

        // Navigation Properties
        public ICollection<BankCard>? BankCards { get; set; } = null!;
        public ICollection<Product>? Cart { get; set; } = null!;
        public ICollection<Product>? Wishlist { get; set; } = null!;
        public ICollection<Address>? Addresses { get; set; } = null!;
    }
}
