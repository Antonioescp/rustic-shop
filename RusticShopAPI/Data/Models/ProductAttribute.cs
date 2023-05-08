namespace RusticShopAPI.Data.Models
{
    public class ProductAttribute
    {
        public long Id { get; set; } 
        public long ProductId { get; set; }
        public long AttributeId { get; set; }
    }
}
