using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RusticShopAPI.Data.Models
{
    public class City
    {
        public long Id { get; set; }
        public string Name { get; set; } = null!;
    }
}
