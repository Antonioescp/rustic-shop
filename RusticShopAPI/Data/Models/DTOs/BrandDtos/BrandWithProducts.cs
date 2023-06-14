using RusticShopAPI.Data.Models.DTOs.ProductDtos;

namespace RusticShopAPI.Data.Models.DTOs.BrandDtos
{
    public class BrandWithProducts
    {
        public string Name { get; set; } = null!;
        public ICollection<ProductNameAndId>? Products { get; set; }
    }
}
