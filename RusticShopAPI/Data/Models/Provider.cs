namespace RusticShopAPI.Data.Models
{
    public class Provider
    {
        public long Id { get; set; }
        public string Name { get; set; } = null!;
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }

        // Nav properties
        public ICollection<Purchase>? Purchases { get; set; }
    }
}
