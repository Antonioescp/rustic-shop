using System.ComponentModel.DataAnnotations;

namespace RusticShopAPI.Data.Models.DTOs
{
    public class ProductAddFeatureRequest
    {
        [Required]
        public string Content { get; set; } = null!;
    }
}
