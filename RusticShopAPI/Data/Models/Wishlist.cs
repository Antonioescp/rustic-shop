namespace RusticShopAPI.Data.Models
{
    public class Wishlist
    {
        public string UserId { get; set; } = null!;
        public long ProductVariantId { get; set; }

        // Nav properties
        public User? User { get; set; }
        public ProductVariant? ProductVariant { get; set; }
    }
}
