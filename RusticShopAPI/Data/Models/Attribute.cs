namespace RusticShopAPI.Data.Models
{
    public class Attribute
    {
        public long Id { get; set; }
        public string Name { get; set; } = null!;

        // Nav properties
        public ICollection<Product>? Products { get; set; }
        public ICollection<ProductAttribute>? ProductAttributes { get; set; }
    }
}
