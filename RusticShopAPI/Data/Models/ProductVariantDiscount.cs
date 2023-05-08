namespace RusticShopAPI.Data.Models
{
    public class ProductVariantDiscount
    {
        public long Id { get; set; }
        public long ProductVariantId { get; set; }
        public long DiscountId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Percentage { get; set; }

        public ProductVariant? ProductVariant { get; set; }
        public Discount? Discount { get; set; }
    }
}
