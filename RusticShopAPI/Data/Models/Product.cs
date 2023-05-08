namespace RusticShopAPI.Data.Models
{
    public class Product
    {
        public long Id { get; set; }
        public long BrandId { get; set; }
        public string Name { get; set; } = null!;
        public string ShortDescription { get; set; } = null!;
        public string Description { get; set; } = null!;
        public bool IsPublished { get; set; } = false;

        // Nav properties
        public Brand? Brand { get; set; }
    }
}
