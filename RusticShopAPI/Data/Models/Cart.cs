namespace RusticShopAPI.Data.Models
{
    public class Cart
    {
        public string UserId { get; set; } = null!;
        public long ProductVariantId { get; set; }
        public long Quantity { get; set; }

        // Nav property
        public User? User { get; set; }
        public ProductVariant? ProductVariant { get; set; }
    }
}
