using System.Text.RegularExpressions;

namespace RusticShopAPI.Shared
{
    public static class Patterns
    {
        public static readonly Regex InvalidUrlCharacters = new(@"[^A-Za-z0-9\-.~:/?#\[\]@!$&'()*+,;=]");
        public static readonly Regex Whitespaces = new(@"\s+");
    }
}