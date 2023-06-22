namespace RusticShopAPI.Data.Models.DTOs.ProductDtos
{
    public class ProductVariantAttributeDto
    {
        public long Id { get; set; }
        public long ProductVariantId { get; set; }
        public long AttributeId { get; set; }
        public string AttributeName { get; set; } = null!;
        public string Value { get; set; } = null!;
    }
}
