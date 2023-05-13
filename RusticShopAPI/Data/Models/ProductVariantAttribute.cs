namespace RusticShopAPI.Data.Models
{
    public class ProductVariantAttribute
    {
        public long Id { get; set; }
        public long? AttributeId { get; set; }
        public long ProductVariantId { get; set; }
        public string Value { get; set; } = null!;

        // Nav properties
        public Attribute? Attribute { get; set; }
        public ProductVariant? ProductVariant { get; set; }
    }
}
