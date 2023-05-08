using System.Security;

namespace RusticShopAPI.Data.Models.DTOs
{
    public class CommonResponse
    {
        public bool Success { get; set; } = false;
        public string Message { get; set; } = string.Empty;
        public List<string> Errors { get; set; } = new();
    }
}
