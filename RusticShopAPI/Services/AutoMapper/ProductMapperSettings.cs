using AutoMapper;
using RusticShopAPI.Data.Models;
using RusticShopAPI.Data.Models.DTOs;
using RusticShopAPI.Data.Models.DTOs.ProductDtos;

namespace RusticShopAPI.Services.AutoMapper
{
    public class ProductMapperSettings : Profile
    {
        public ProductMapperSettings()
        {
            CreateMap<Product, ProductNameAndId>();
            CreateMap<Product, ProductDetailDto>();
            CreateMap<Product, ProductWithBrandName>();
            CreateMap<Category, CategoryDetailDto>();

            CreateMap<ProductVariant, ProductVariantDetailDto>()
                .ForMember(pvd => pvd.Attributes, opt => opt.MapFrom(pv => pv.ProductVariantAttributes));

            CreateMap<ProductImage, ProductImageDto>();
            CreateMap<ProductVariantAttribute, ProductVariantAttributeDto>();
            CreateMap<ProductVariantDiscount, ProductVariantDiscountDetailDto>();
            CreateMap<PaginatedResult<Product>, PaginatedResult<ProductDetailDto>>();
        }
    }
}
