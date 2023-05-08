
using System.ComponentModel.DataAnnotations;

namespace RusticShopAPI.Data.Models.DTOs
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "Email address is required")]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; } = null!;
    }
}
