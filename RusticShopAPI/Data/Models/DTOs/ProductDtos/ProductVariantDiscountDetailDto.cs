namespace RusticShopAPI.Data.Models.DTOs.ProductDtos
{
    public class ProductVariantDiscountDetailDto
    {
        public string DiscountName { get; set; } = null!;
        public string DiscountDescription { get; set; } = null!;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Percentage { get; set; }
        public int PercentageInteger => (int)(Percentage * 100);
    }
}
