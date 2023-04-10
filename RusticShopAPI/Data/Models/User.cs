using System.ComponentModel.DataAnnotations.Schema;

namespace RusticShopAPI.Data.Models
{
    public class User
    {
        public long Id { get; set; }
        public string? IdentificationCardNumber { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set;}
        public string? Username { get; set; }
        public string? PhoneNumber { get; set; }
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public bool IsAdmin { get; set; } = false;

        // Metadata
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
