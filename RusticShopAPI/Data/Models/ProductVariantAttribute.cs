namespace RusticShopAPI.Data.Models
{
    public class ProductVariantAttribute
    {
        public long Id { get; set; }
        public long? ProductAttributeId { get; set; }
        public long ProductVariantId { get; set; }
        public string Value { get; set; } = null!;

        // Nav properties
        public ProductAttribute? ProductAttribute { get; set; }
        public ProductVariant? ProductVariant { get; set; }
    }
}
