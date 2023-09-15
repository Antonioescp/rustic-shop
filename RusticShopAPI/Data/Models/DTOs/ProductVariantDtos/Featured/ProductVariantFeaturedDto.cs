namespace RusticShopAPI.Data.Models.DTOs.ProductDtos
{
    public class ProductVariantFeaturedDto
    {
        public long Id { get; set; }
        public string ProductName { get; set; } = null!;
        public string ProductBrandName { get; set; } = null!;
        public string ProductDescription { get; set; } = null!;
        public string ProductShortDescription { get; set; } = null!;
        public decimal UnitPrice { get; set; }
        public ProductVariantDiscountFeaturedDto? CurrentDiscount { get; set; }
        public decimal? DiscountedUnitPrice { get; set; }
        public bool? HasDiscount { get; set; }
        public ICollection<ProductImageFeaturedDto>? Images { get; set; }
    }
}
