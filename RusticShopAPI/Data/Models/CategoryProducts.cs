namespace RusticShopAPI.Data.Models
{
    public class CategoryProduct
    {
        public long CategoryId { get; set; }
        public long ProductId { get; set; }

        // Nav properties
        public Category? Category { get; set; }
        public Product? Product { get; set; }
    }
}
