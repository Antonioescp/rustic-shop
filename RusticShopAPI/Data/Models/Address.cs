using RusticShopAPI.Data.Models.Users;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RusticShopAPI.Data.Models
{
    public class Address
    {
        [Required]
        [Key]
        public long Id { get; set; }

        [Required]
        [ForeignKey(nameof(User))]
        public string UserId { get; set; } = null!;

        [Required]
        public string Directions { get; set; } = null!;

        [Required]
        public string Neighborhood { get; set; } = null!;

        [Required]
        public string City { get; set; } = null!;

        [Required]
        public string HouseNumber { get; set; } = null!;

        // Navigations
        public User? User { get; set; } = null!;
        public BillingAddress? BillingAddress { get; set; } = null!;
    }
}
