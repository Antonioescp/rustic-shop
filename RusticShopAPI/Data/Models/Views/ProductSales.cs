namespace RusticShopAPI.Data.Models.Views
{
    public class ProductSales
    {
        public string BrandName { get; set; } = null!;
        public string ProductName { get; set; } = null!;
        public long Purchases { get; set; }
        public decimal Costs { get; set; }
        public long Sales { get; set; }
        public decimal Incomes { get; set; }
        public decimal Profit { get; set; }
    }
}
