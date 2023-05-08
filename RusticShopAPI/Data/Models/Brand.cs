using System.ComponentModel.DataAnnotations;

namespace RusticShopAPI.Data.Models
{
    public class Brand
    {
        [Required]
        [Key]
        public long Id { get; set; }

        [Required]
        public string Name { get; set; } = null!;
    }
}
