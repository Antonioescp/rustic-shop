using Microsoft.Build.Framework;

namespace RusticShopAPI.Data.Models.DTOs
{
    public class UserNameOnlyDto
    {
        [Required]
        public string Username { get; set; } = null!;
    }
}
