namespace RusticShopAPI.Data.Models.DTOs.ProductDtos
{
    public class ProductVariantListItem
    {
        public long Id { get; set; }
        public string ProductName { get; set; } = null!;
        public string ProductBrandName { get; set; } = null!;
        public string SKU { get; set; } = null!;
        public decimal UnitPrice { get; set; }
        public bool IsPublished { get; set; }
    }
}
