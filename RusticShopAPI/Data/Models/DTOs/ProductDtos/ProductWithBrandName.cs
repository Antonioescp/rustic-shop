namespace RusticShopAPI.Data.Models.DTOs.ProductDtos
{
    public class ProductWithBrandName
    {
        public long Id { get; set; }
        public string Name { get; set; } = null!;
        public string BrandName { get; set; } = null!;
    }
}
