using System.ComponentModel.DataAnnotations;

namespace RusticShopAPI.Data.Models.DTOs
{
    public class FeatureNameOnlyDto
    {
        [Required]
        public string FeatureName { get; set; } = null!;
    }
}
