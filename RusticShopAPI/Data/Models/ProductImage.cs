namespace RusticShopAPI.Data.Models
{
    public class ProductImage
    {
        public long Id { get; set; }
        public long ProductId { get; set; }
        public string URL { get; set; } = null!;

        // Nav properties
        public Product? Product { get; set; }
    }
}
