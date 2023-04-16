using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RusticShopAPI.Data.Models
{
    [Table("Categories")]
    public class Category
    {
        [Key]
        [Required]
        public long Id { get; set; }

        [Required]
        public string Name { get; set; } = null!;

        // Navigations
        public ICollection<Product> Products { get; set; } = null!;
    }
}
