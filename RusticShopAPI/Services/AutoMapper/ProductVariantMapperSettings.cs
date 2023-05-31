using AutoMapper;
using RusticShopAPI.Data.Models;
using RusticShopAPI.Data.Models.DTOs;
using RusticShopAPI.Data.Models.DTOs.ProductDtos;

namespace RusticShopAPI.Services.AutoMapper
{
    public class ProductVariantMapperSettings : Profile
    {
        public ProductVariantMapperSettings()
        {
            CreateMap<ProductVariant, ProductVariantListItem>();
            CreateMap<PaginatedResult<ProductVariant>, PaginatedResult<ProductVariantListItem>>();
        }
    }
}
