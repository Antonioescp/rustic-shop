namespace RusticShopAPI.Data.Models
{
    public class Discount
    {
        public long Id { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;

        // Nav properties
        public ICollection<ProductVariant>? ProductVariants { get; set; }
        public ICollection<ProductVariantDiscount>? ProductVariantDiscounts { get; set; }
    }
}
