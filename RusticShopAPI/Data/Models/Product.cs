using NuGet.Packaging;
using System.Runtime.InteropServices;

namespace RusticShopAPI.Data.Models
{
    public class Product
    {
        public long Id { get; set; }
        public long BrandId { get; set; }
        public string Name { get; set; } = null!;
        public string ShortDescription { get; set; } = null!;
        public string Description { get; set; } = null!;
        public bool IsPublished { get; set; } = false;

        // Nav properties
        public Brand? Brand { get; set; }
        public ICollection<ProductVariant>? Variants { get; set; }
        public ICollection<Attribute>? Attributes { get; set; }
        public ICollection<Category>? Categories { get; set; }
        public ICollection<ProductImage>? Images { get; set; }

        // Computed properties
        public long? Stock
        {
            get
            {
                var purchasesDetails = Variants?
                    .Select(pv => pv.PurchaseDetails)
                    .Aggregate(new List<PurchaseDetail>(), (current, pdl) =>
                    {
                        if (pdl == null) return current;
                        current.AddRange(pdl);
                        return current;
                    });

                var ordersDetails = Variants?
                    .Select(pv => pv.OrderDetails)
                    .Aggregate(new List<OrderDetail>(), (current, odl) =>
                    {
                        if (odl == null) return current;
                        current.AddRange(odl);
                        return current;
                    });

                var refundsDetails = Variants?
                    .Select(pv => pv.RefundDetails)
                    .Aggregate(new List<RefundDetail>(), (current, rfdl) =>
                    {
                        if (rfdl == null) return current;
                        current.AddRange(rfdl);
                        return current;
                    });

                if (purchasesDetails == null ||
                    ordersDetails == null ||
                    refundsDetails == null )
                {
                    return null;
                }

                var purchases = purchasesDetails
                    .Aggregate(0L, (current, next) => current + next.Quantity);
                var orders = ordersDetails
                    .Aggregate(0L, (current, next) => current + next.Quantity);
                var refunds = refundsDetails
                    .Aggregate(0L, (current, next) => current + next.Quantity);

                return purchases + refunds - orders;
            }
        }
    }
}
