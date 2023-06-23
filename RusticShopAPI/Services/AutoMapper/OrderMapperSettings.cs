using AutoMapper;
using RusticShopAPI.Data.Models;
using RusticShopAPI.Data.Models.DTOs;
using RusticShopAPI.Data.Models.DTOs.OrderDtos;

namespace RusticShopAPI.Services.AutoMapper
{
    public class OrderMapperSettings : Profile
    {
        public OrderMapperSettings()
        {
            CreateMap<Order, OrderDetailsDto>()
                .ForMember(
                    dest => dest.UserFullName,
                    opt => opt.MapFrom(src => $"{src.User!.FirstName} {src.User!.LastName}"));

            CreateMap<PaginatedResult<Order>, PaginatedResult<OrderDetailsDto>>();
            CreateMap<OrderDetail, OrderSummaryDetailDto>();
            CreateMap<Order, OrderSummaryDto>();
        }
    }
}
