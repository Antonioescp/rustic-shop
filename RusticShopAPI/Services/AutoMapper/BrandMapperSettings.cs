using AutoMapper;
using RusticShopAPI.Data.Models;
using RusticShopAPI.Data.Models.DTOs.BrandDtos;

namespace RusticShopAPI.Services.AutoMapper
{
    public class BrandMapperSettings : Profile
    {
        public BrandMapperSettings()
        {
          CreateMap<Brand, BrandWithProducts>();
        }
    }
}
