namespace RusticShopAPI.Data.Models
{
    public class Category
    {
        public long Id { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;

        // Nav properties
        public ICollection<Product>? Products { get; set; }
    }
}
