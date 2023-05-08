namespace RusticShopAPI.Data.Models
{
    public class PaymentMethod
    {
        public long Id { get; set; }
        public string CardHolderId { get; set; } = null!;
        public string NameOnCard { get; set; } = null!;
        public string PAN { get; set; } = null!;
        public DateTime ExpirationDate { get; set; }

        public User? CardHolder { get; set; }
        public ICollection<Order>? Orders { get; set; }

    }
}
