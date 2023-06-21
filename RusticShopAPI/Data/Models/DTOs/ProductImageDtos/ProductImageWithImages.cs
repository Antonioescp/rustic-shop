namespace RusticShopAPI.Data.Models.DTOs.ProctImageDtos
{
    public class ProductImageWithImages
    {
        public List<FormFile> Images { get; set; } = null!;
        public ProductImage ProductImage { get; set; } = null!;
    }
}
