using System.ComponentModel.DataAnnotations;

namespace RusticShopAPI.Data.Models.Auth
{
    public class PasswordResetRequest
    {
        [Required]
        public string Email { get; set; } = null!;
    }
}
