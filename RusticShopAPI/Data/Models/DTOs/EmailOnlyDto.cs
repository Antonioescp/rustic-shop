using Microsoft.Build.Framework;

namespace RusticShopAPI.Data.Models.DTOs
{
    public class EmailOnlyDto
    {
        [Required]
        public string Email { get; set; } = null!;
    }
}
