﻿namespace RusticShopAPI.Data.Models
{
    public class ProductVariant
    {
        public long Id { get; set; }
        public long ProductId { get; set; }
        public string SKU { get; set; } = null!;
        public decimal UnitPrice { get; set; }
        public bool IsPublished { get; set; }

        // Nav properties
        public Product? Product { get; set; }
    }
}