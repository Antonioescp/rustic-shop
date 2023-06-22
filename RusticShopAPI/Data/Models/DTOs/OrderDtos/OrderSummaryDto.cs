namespace RusticShopAPI.Data.Models.DTOs.OrderDtos
{
    public class OrderSummaryDto
    {
        public long Id { get; set; }
        public string Status { get; set; } = null!;
        public DateTime Date { get; set; }
        public decimal? Total { get; set; }
        public long? ProductCount { get; set; }

        // User data
        public string UserFirstName { get; set; } = null!;
        public string UserLastName { get; set; } = null!;
        public string UserPhoneNumber { get; set; } = null!;
        public string UserEmail { get; set; } = null!;


        // Address data
        public string ShippingAddressName { get; set; } = null!;
        public string ShippingAddressDirections { get; set; } = null!;
        public string ShippingAddressHouseNumber { get; set; } = null!;
        public string ShippingAddressNeighborhoodName { get; set; } = null!;
        public string ShippingAddressNeighborhoodCityName { get; set; } = null!;

        // Nav properties
        public ICollection<OrderSummaryDetailDto>? OrderDetails { get; set; }
    }
}
