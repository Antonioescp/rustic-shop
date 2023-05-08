namespace RusticShopAPI.Data.Models
{
    public class Address
    {
        public long Id { get; set; }
        public string UserId { get; set; } = null!;
        public long NeighborhoodId { get; set; }
        public string Name { get; set; } = null!;
        public string Directions { get; set; } = null!;
        public string HouseNumber { get; set; } = null!;

        // Nav properties
        public User? User { get; set; }
        public Neighborhood? Neighborhood { get; set; }
    }
}
