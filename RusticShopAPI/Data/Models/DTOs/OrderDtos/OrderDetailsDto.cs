namespace RusticShopAPI.Data.Models.DTOs.OrderDtos
{
    public class OrderDetailsDto
    {
        public long Id { get; set; }
        public string UserFullName { get; set; } = null!;
        public string Status { get; set; } = null!;
        public DateTime Date { get; set; }
        public decimal? Total { get; set; }
        public long? ProductCount { get; set; }
    }
}
