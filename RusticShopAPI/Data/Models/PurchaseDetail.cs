namespace RusticShopAPI.Data.Models
{
    public class PurchaseDetail
    {
        public long Id { get; set; }
        public long PurchaseId { get; set; }
        public long ProductVariantId { get; set; }
        public long Quantity { get; set; }
        public decimal UnitPrice { get; set; }

        // Nav properties
        public Purchase? Purchase { get; set; }
        public ProductVariant? ProductVariant { get; set; }

    }
}
