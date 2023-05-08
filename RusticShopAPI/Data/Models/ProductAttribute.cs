using System.ComponentModel.DataAnnotations.Schema;

namespace RusticShopAPI.Data.Models
{
    public class ProductAttribute
    {
        public long Id { get; set; } 
        public long ProductId { get; set; }
        public long AttributeId { get; set; }

        [NotMapped]
        public string? AttributeName => Attribute?.Name;

        // Nav properties
        public Product? Product { get; set; }
        public Attribute? Attribute { get; set; }

        public ICollection<ProductVariant>? ProductVariants { get; set; }
    }
}
