﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RusticShopAPI.Data.Models
{
    [Table("Features")]
    public class Feature
    {
        [Required]
        [Key]
        public long Id { get; set; }

        [Required]
        public string Name { get; set; } = null!;

        // Navigations
        public ICollection<Product>? Products { get; set; } = null!;
        public ICollection<FeatureProduct>? FeatureProducts { get; set; } = null!;
    }
}
