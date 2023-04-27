using System.ComponentModel.DataAnnotations.Schema;

namespace RusticShopAPI.Data.Models.Views
{
    public class VProductSummary
    {
        public long Id { get; set; }
        public string Name { get; set; } = null!;
        public string ShortDescription { get; set; } = null!;

        [Column(TypeName = "MONEY")]
        public decimal UnitPrice { get; set; }
        public string? Categories { get; set; } = null!;
        public int ImagesCount { get; set; }
        public bool IsPublished { get; set; }
    }
}
