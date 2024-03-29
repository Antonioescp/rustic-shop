﻿namespace RusticShopAPI.Data.Models
{
    public class Brand
    {
        public long Id { get; set; }
        public string Name { get; set; } = null!;

        // Nav properties
        public ICollection<Product>? Products { get; set; }
    }
}
