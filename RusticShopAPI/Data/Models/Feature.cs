using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RusticShopAPI.Data.Models
{
    [Table("Features")]
    public class Feature
    {
        [Required]
        [Key]
        public long Id { get; set; }

        [Required]
        [ForeignKey(nameof(Product))]
        public long ProductId { get; set; }

        [Required]
        public string Type { get; set; } = null!;

        [Required]
        public string Value { get; set; } = null!;

        // Navigations
        public Product Product { get; set; } = null!;
    }
}
