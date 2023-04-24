using System.ComponentModel.DataAnnotations;

namespace RusticShopAPI.Data.Models.Auth
{
    public class AccountUnlockRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;
    }
}
