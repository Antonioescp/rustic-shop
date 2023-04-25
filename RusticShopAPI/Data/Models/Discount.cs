using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RusticShopAPI.Data.Models
{
    public class Discount
    {
        [Required]
        [Key]
        public long Id { get; set; }

        [Required]
        public string Name { get; set; } = null!;

        [Required]
        [Column(TypeName = "TEXT")]
        public string Description { get; set; } = null!;

        public ICollection<Product>? Products { get; set; } = null!;
        public ICollection<DiscountProduct>? DiscountProducts { get; set; } = null!;
    }
}
