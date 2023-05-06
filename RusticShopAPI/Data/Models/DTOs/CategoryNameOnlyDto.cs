using System.ComponentModel.DataAnnotations;

namespace RusticShopAPI.Data.Models.DTOs
{
    public class CategoryNameOnlyDto
    {
        [Required]
        public string CategoryName { get; set; } = null!;
    }
}
