﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace RusticShopAPI.Data.Models.Settings
{
    public class ProductVariantEntityTypeConfiguration : IEntityTypeConfiguration<ProductVariant>
    {
        public void Configure(EntityTypeBuilder<ProductVariant> builder)
        {
            builder.ToTable("ProductVariants");
            builder.HasKey(pv => pv.Id);
            
            builder
                .HasIndex(pv => pv.SKU)
                .IsUnique();

            builder
                .Property(pv => pv.SKU)
                .IsRequired();

            builder
                .Property(pv => pv.UnitPrice)
                .HasColumnType("MONEY")
                .IsRequired();

            builder
                .Property(pv => pv.IsPublished)
                .HasDefaultValue(false)
                .IsRequired();
                
        }
    }
}