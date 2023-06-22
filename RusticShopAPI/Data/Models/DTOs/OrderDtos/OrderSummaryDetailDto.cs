namespace RusticShopAPI.Data.Models.DTOs.OrderDtos
{
    public class OrderSummaryDetailDto
    {
        public long Id { get; set; }
        public long Quantity { get; set; }
        public long UnitPrice { get; set; }
        public decimal Total { get; set; }

        // Variant details
        public string ProductVariantSKU { get; set; } = null!;

    }
}
