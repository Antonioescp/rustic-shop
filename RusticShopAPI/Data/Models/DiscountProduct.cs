using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RusticShopAPI.Data.Models
{
    public class DiscountProduct
    {
        [Required]
        [ForeignKey(nameof(Product))]
        public long ProductId { get; set; }

        [Required]
        [ForeignKey(nameof(Discount))]
        public long DiscountId { get; set; }

        [Required]
        [Column(TypeName = "DECIMAL(3,2)")]
        [Range(0, 1.0)]
        public float Percentage { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        // Navigations
        public Product? Product { get; set; } = null!;
        public Discount? Discount { get; set; } = null!;
    }
}
