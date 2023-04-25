using System.ComponentModel.DataAnnotations;

namespace RusticShopAPI.Data.Models
{
    public class Provider
    {
        [Required]
        [Key]
        public long Id { get; set; }

        [Required]
        public string Name { get; set; } = null!;

        [Required]
        [Phone]
        public string PhoneNumber { get; set; } = null!;

        // Navigations
        public ICollection<Purchase>? Purchases { get; set; } = null!;
    }
}
