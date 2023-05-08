namespace RusticShopAPI.Data.Models
{
    public class Purchase
    {
        public long Id { get; set; }
        public long ProviderId { get; set; }
        public DateTime Date { get; set; }

        // Nav properties
        public Provider? Provider { get; set; }
        public ICollection<ProductVariant>? ProductVariants { get; set; }
        public ICollection<PurchaseDetail>? PurchaseDetails { get; set; }
    }
}
