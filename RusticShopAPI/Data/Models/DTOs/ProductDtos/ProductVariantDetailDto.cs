namespace RusticShopAPI.Data.Models.DTOs.ProductDtos
{
    public class ProductVariantDetailDto
    {
        public long Id { get; set; }
        public string SKU { get; set; } = null!;
        public decimal UnitPrice { get; set; }
        public long Stock { get; set; }

        // Computed properties
        public long? WishlistedCount { get; set; }
        public bool? HasDiscount { get; set; }
        public ProductVariantDiscountDetailDto? CurrentDiscount { get; set; }
        public decimal? DiscountedUnitPrice { get; set; }
        public ICollection<ProductVariantAttributeDto>? Attributes { get; set; }
        public ICollection<ProductImageDto>? Images { get; set; }
    }
}
