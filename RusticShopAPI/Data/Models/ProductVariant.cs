using Org.BouncyCastle.Bcpg.OpenPgp;

namespace RusticShopAPI.Data.Models
{
    public class ProductVariant
    {
        public long Id { get; set; }
        public long ProductId { get; set; }
        public string SKU { get; set; } = null!;
        public decimal UnitPrice { get; set; }
        public bool IsPublished { get; set; }

        // Computed properties
        public long? Stock
        {
            get
            {
                if (OrderDetails == null || RefundDetails == null || PurchaseDetails == null)
                {
                    return null;
                }

                var orders = OrderDetails.Aggregate(0L, (current, next) => current + next.Quantity);
                var purchases = PurchaseDetails.Aggregate(0L, (current, next) => current + next.Quantity);
                var refunds = RefundDetails.Aggregate(0L, (current, next) => current + next.Quantity);

                return purchases + refunds - orders;
            }
        }

        public long? WishlistedCount => WishlistedByUsers?.Count;

        public bool? HasDiscount => ProductVariantDiscounts
            ?.Any(pvd => pvd.EndDate >= DateTime.UtcNow);

        public ProductVariantDiscount? CurrentDiscount => ProductVariantDiscounts
            ?.OrderBy(pvd => pvd.EndDate)
            ?.FirstOrDefault(pvd => pvd.EndDate > DateTime.UtcNow);

        public decimal? DiscountedUnitPrice => UnitPrice * (1 - CurrentDiscount?.Percentage);

        // Nav properties
        public Product? Product { get; set; }
        public ICollection<ProductVariantAttribute>? ProductVariantAttributes { get; set; }
        public ICollection<Attribute>? Attributes { get; set; }
        public ICollection<ProductImage>? Images { get; set; }
        public ICollection<Discount>? Discounts { get; set; }
        public ICollection<ProductVariantDiscount>? ProductVariantDiscounts { get; set; }
        public ICollection<Order>? Orders { get; set; }
        public ICollection<OrderDetail>? OrderDetails { get; set; }
        public ICollection<Purchase>? Purchases { get; set; } 
        public ICollection<PurchaseDetail>? PurchaseDetails { get; set; }
        public ICollection<Refund>? Refunds { get; set; }
        public ICollection<RefundDetail>? RefundDetails { get; set; }
        public ICollection<User>? CartUsers { get; set; }
        public ICollection<Cart>? Carts { get; set; }
        public ICollection<User>? WishlistedByUsers { get; set; }
    }
}
