using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace RusticShopAPI.Data.Models.DTOs
{
    public class RegistrationRequest
    {
        [Required(ErrorMessage = "El nombre de usuario es requerido")]
        public string UserName { get; set; } = null!;

        [Required(ErrorMessage = "El correo electrónico es requerido")]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "La contraseña es requerida")]
        [MinLength(8, ErrorMessage = "La contraseña debe tener al menos 8 carácteres")]
        public string Password { get; set; } = null!;

        [Required(ErrorMessage = "Confirmar la contraseña es requerido")]
        [Compare(nameof(Password), ErrorMessage = "Las contraseñas no coinciden")]
        public string ConfirmPassword { get; set; } = null!;
    }
}
