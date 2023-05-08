namespace RusticShopAPI.Data.Models
{
    public class Neighborhood
    {
        public long Id { get; set; }
        public long CityId { get; set; }
        public string Name { get; set; } = null!;
        public City? City { get; set; }
    }
}
