namespace RusticShopAPI.Data.Models
{
    public class RefundDetail
    {
        public long Id { get; set; }
        public long RefundId { get; set; }
        public long ProductVariantId { get; set; }
        public long Quantity { get; set; }

        // Nav properties
        public Refund? Refund { get; set; }
        public ProductVariant? ProductVariant { get; set; }
    }
}
