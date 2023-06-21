namespace RusticShopAPI.Data.Models.DTOs.ProductVariantImageDtos
{
    public class ProductVariantImageOnlyDto
    {
        public long Id { get; set; }
        public long ProductId { get; set; }
        public string URL { get; set; } = null!;
    }
}
