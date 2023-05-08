using Microsoft.AspNetCore.Identity;

namespace RusticShopAPI.Data.Models.DTOs
{
    public class UserDTO
    {
        // IdentityUser already has an Id, a Phone Number, an Email and a password hash
        [ProtectedPersonalData]
        public string? IdentificationCardNumber { get; set; }
        [PersonalData]
        public string? FirstName { get; set; }
        [PersonalData]
        public string? LastName { get; set; }
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? PhoneNumber { get; set; } = null!;
        public bool EmailConfirmed { get; set; }

        public static UserDTO From(User user)
        {
            return new UserDTO
            {
                IdentificationCardNumber = user.IdentificationCardNumber,
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserName = user.UserName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                EmailConfirmed = user.EmailConfirmed
            };
        }
    }
}
