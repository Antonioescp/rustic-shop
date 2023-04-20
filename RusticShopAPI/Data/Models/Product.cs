using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using RusticShopAPI.Data.Models.Users;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RusticShopAPI.Data.Models
{
    [Table("Products")]
    public class Product
    {
        [Required]
        [Key]
        public long Id { get; set; }

        [Required]
        public long CategoryId { get; set; }

        [Required]
        public string Name { get; set; } = null!;

        [Required]
        [Column(TypeName = "MONEY")]
        public decimal Price { get; set; }

        [Required]
        public string ShortDescription { get; set; } = null!;
        public string? Description { get; set; }

        [Required]
        public int Stock { get; set; }

        [Required]
        public bool IsPublished { get; set; } = true;

        // Metadata
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigations
        public Category? Category { get; set; } = null!;
        public ICollection<Feature>? Features { get; set; } = null!;
        public ICollection<ProductImage>? Images { get; set; } = null!;
        public ICollection<User>? Wishlists { get; set; } = null!;
        public ICollection<User>? Carts { get; set; } = null!;
    }
}
