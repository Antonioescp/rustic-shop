using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RusticShopAPI.Data.Models
{
    [Table("ProductImage")]
    public class ProductImage
    {
        [Required]
        [Key]
        public long Id { get; set; }

        [Required]
        [ForeignKey(nameof(Product))]
        public long ProductId { get; set; }

        [Required]
        [Url]
        public string Url { get; set; } = null!;

        // Navigations
        public Product? Product { get; set; } = null!;
    }
}
