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
        public long? Stock => Variants?.Sum(pv => pv.Stock);
    }
}
