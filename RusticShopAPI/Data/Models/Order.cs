namespace RusticShopAPI.Data.Models
{
    public class Order
    {
        public long Id { get; set; }
        public string UserId { get; set; } = null!;
        public long PaymentMethodId { get; set; }
        public long ShippingAddressId { get; set; }
        public string Status { get; set; } = null!;
        public DateTime Date { get; set; }

        // Computed properties
        public decimal? Total => ProductVariants?.Aggregate(
                    0M, 
                    (decimal current, ProductVariant product) => current + product.UnitPrice);

        // Nav properties
        public User? User { get; set; }
        public PaymentMethod? PaymentMethod { get; set; }
        public Address? ShippingAddress { get; set; }
        public ICollection<ProductVariant>? ProductVariants { get; set; }
        public ICollection<OrderDetail>? OrderDetails { get; set; }
        public ICollection<Refund>? Refunds { get; set; }
    }
}
