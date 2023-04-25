using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Org.BouncyCastle.Bcpg.Sig;
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
        public string Name { get; set; } = null!;

        [Required]
        [Column(TypeName = "MONEY")]
        public decimal UnitPrice { get; set; }

        [Required]
        public string ShortDescription { get; set; } = null!;
        public string? Description { get; set; } = null;

        [Required]
        [Column(TypeName = "BIT")]
        public bool IsPublished { get; set; } = false;

        // Navigation properties
        public ICollection<Category>? Categories { get; set; } = null!;
        public ICollection<Feature>? Features { get; set; } = null!;
        public ICollection<FeatureProduct>? FeatureProducts { get; set; } = null!;
        public ICollection<ProductImage>? Images { get; set; } = null!;
        public ICollection<Discount>? Discounts { get; set; } = null!;
        public ICollection<DiscountProduct>? DiscountProducts { get; set; } = null!; 
        public ICollection<User>? Wishlists { get; set; } = null!;
        public ICollection<User>? Carts { get; set; } = null!;
        public ICollection<Transaction> Transactions { get; set; } = null!;
        public ICollection<ProductTransaction>? ProductTransactions { get; set; } = null!;
    }
}
