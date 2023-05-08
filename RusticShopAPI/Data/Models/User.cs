using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace RusticShopAPI.Data.Models
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

        // Nav properties
        public ICollection<Address>? Addresses { get; set; }
        public ICollection<Product>? CartProducts { get; set; }
        public ICollection<Product>? WishlistedProducts { get; set; }
        public ICollection<Cart>? Cart { get; set; }
        public ICollection<PaymentMethod>? PaymentMethods { get; set; }
        public ICollection<Order>? Orders { get; set; }
        public ICollection<Refund>? Refunds { get; set; }
    }
}
