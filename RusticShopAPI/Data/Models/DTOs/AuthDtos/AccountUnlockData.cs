using System.ComponentModel.DataAnnotations;

namespace RusticShopAPI.Data.Models.Auth
{
    public class AccountUnlockData
    {
        [Required]
        public string Username { get; set; } = null!;
        [Required]
        public string Token { get; set; } = null!;
    }
}
