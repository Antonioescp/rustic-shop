namespace RusticShopAPI.Data.Models
{
    public class OrderDetail
    {
        public long Id { get; set; }
        public long OrderId { get; set; }
        public long ProductVariantId { get; set; }
        public long Quantity { get; set; }
        public decimal UnitPrice { get; set; }

        // Nav properties
        public Order? Order { get; set; }
        public ProductVariant? ProductVariant { get; set; }
    }
}
