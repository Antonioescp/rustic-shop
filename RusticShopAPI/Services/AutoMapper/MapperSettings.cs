using AutoMapper;

namespace RusticShopAPI.Services.AutoMapper
{
    public class MapperSettings : Profile
    {
        public MapperSettings()
        {
            AllowNullCollections = true;
        }
    }
}
