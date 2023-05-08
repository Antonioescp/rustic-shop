namespace RusticShopAPI.Data.Models
{
    public class ProductVariantImage
    {
        public long Id { get; set; }
        public long? ProductImageId { get; set; }
        public long ProductVariantId { get; set; }

        public ProductImage? ProductImage { get; set; }
        public ProductVariant? ProductVariant { get; set; }
    }
}
