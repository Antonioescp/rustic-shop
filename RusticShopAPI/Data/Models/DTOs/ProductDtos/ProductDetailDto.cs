namespace RusticShopAPI.Data.Models.DTOs.ProductDtos
{
    public class ProductDetailDto
    {
        public string Name { get; set; } = null!;
        public string BrandName { get; set; } = null!;
        public string ShortDescription { get; set; } = null!;
        public string Description { get; set; } = null!;
        // TODO(Add stock)

        public ICollection<ProductVariantDetailDto>? Variants { get; set; }
        public ICollection<CategoryDetailDto>? Categories { get; set; }
        public ICollection<ProductImageDto>? Images { get; set; }

    }
}
