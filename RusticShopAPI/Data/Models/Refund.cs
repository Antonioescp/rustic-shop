namespace RusticShopAPI.Data.Models
{
    public class Refund
    {
        public long Id { get; set; }
        public string UserId { get; set; } = null!;
        public long OrderId { get; set; }
        public string Reason { get; set; } = null!;
        public DateTime Date { get; set; }

        // Nav properties
        public User? User { get; set; }
        public Order? Order { get; set; }
        public ICollection<ProductVariant>? RefundedProducts { get; set; }
        public ICollection<RefundDetail>? RefundDetails { get; set; }
    }
}
