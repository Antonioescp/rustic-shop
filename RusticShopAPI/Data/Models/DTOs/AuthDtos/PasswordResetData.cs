using System.ComponentModel.DataAnnotations;

namespace RusticShopAPI.Data.Models.Auth
{
    public class PasswordResetData
    {
        [Required]
        public string Password { get; set; } = null!;

        [Required]
        [Compare(nameof(Password))]
        public string ConfirmPassword { get; set; } = null!;

        [Required]
        public string Username { get; set; } = null!;

        [Required]
        public string Token { get; set; } = null!;
    }
}
