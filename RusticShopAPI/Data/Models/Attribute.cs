namespace RusticShopAPI.Data.Models
{
    public class Attribute
    {
        public long Id { get; set; }
        public string Name { get; set; } = null!;

        // Nav properties
        public ICollection<Product>? Products { get; set; }
        public ICollection<ProductVariant>? ProductVariants { get; set; }
        public ICollection<ProductVariantAttribute>? ProductVariantAttributes { get; set; }
    }
}
