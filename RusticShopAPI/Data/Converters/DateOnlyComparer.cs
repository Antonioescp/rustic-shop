using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace RusticShopAPI.Data.Converters
{
    public class DateOnlyComparer : ValueComparer<DateOnly>
    {
        public DateOnlyComparer() : base(
            (d1, d2) => d1.DayNumber == d2.DayNumber && d1.Month == d2.Month && d1.Year == d2.Year,
            d => d.GetHashCode())
        {

        }
    }
}
