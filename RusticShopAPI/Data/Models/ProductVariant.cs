namespace RusticShopAPI.Data.Models
{
    public class ProductVariant
    {
        public long Id { get; set; }
        public long ProductId { get; set; }
        public string SKU { get; set; } = null!;
        public decimal UnitPrice { get; set; }
        public bool IsPublished { get; set; }

        // Nav properties
        public Product? Product { get; set; }
        public ICollection<ProductVariantAttribute>? ProductVariantAttributes { get; set; }
        public ICollection<ProductAttribute>? ProductAttributes { get; set; }
        public ICollection<ProductImage>? Images { get; set; }
        public ICollection<Discount>? Discounts { get; set; }
        public ICollection<ProductVariantDiscount>? ProductVariantDiscounts { get; set; }
    }
}
