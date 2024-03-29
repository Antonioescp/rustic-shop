﻿namespace RusticShopAPI.Data.Models
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
        public decimal? Total => OrderDetails?.Aggregate(0M, (acc, od) => acc + od.Total);

        public long? ProductCount => OrderDetails?.Aggregate(0L, (acc, od) => acc + od.Quantity);

        // Nav properties
        public User? User { get; set; }
        public PaymentMethod? PaymentMethod { get; set; }
        public Address? ShippingAddress { get; set; }
        public ICollection<ProductVariant>? ProductVariants { get; set; }
        public ICollection<OrderDetail>? OrderDetails { get; set; }
    }
}
