namespace RusticShopAPI.Data.Models
{
    public class Cart
    {
        public string UserId { get; set; } = null!;
        public long ProductId { get; set; }
        public long Quantity { get; set; }

        // Nav property
        public User? User { get; set; }
        public Product? Product { get; set; }
    }
}
