using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace RusticShopAPI.Data.Models.DTOs
{
    public class UserUpdateRequest
    {
        [ProtectedPersonalData]
        public string? IdentificationCardNumber { get; set; }

        [Required]
        public string UserName { get; set; } = null!;

        [PersonalData]
        public string? FirstName { get; set; }

        [PersonalData]
        public string? LastName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        [Phone]
        public string? PhoneNumber { get; set; }
    }
}
