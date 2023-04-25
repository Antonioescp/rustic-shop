using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RusticShopAPI.Data.Models
{
    public class FeatureProduct
    {
        [Required]
        [ForeignKey(nameof(Product))]
        public long ProductId { get; set; }

        [Required]
        [ForeignKey(nameof(Feature))]
        public long FeatureId { get; set; }

        [Required]
        public string Content { get; set; } = null!;

        // Navigations
        public Product? Product { get; set; } = null!;
        public Feature? Feature { get; set; } = null!;
    }
}
