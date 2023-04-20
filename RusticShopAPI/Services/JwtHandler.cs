using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using RusticShopAPI.Data.Models.Users;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RusticShopAPI.Services
{
    public class JwtHandler
    {
        private readonly IConfiguration _configuraton;
        private readonly UserManager<User> _userManager;

        public JwtHandler(
            IConfiguration configuration,
            UserManager<User> userManager)
        {
            _configuraton = configuration;
            _userManager = userManager;
        }

        public async Task<JwtSecurityToken> GetTokenAsync(User user)
        {
            var jwtOptions = new JwtSecurityToken(
                issuer: _configuraton["JwtSettings:Issuer"],
                audience: _configuraton["JwtSettings:Audience"],
                claims: await GetClaimsAsync(user),
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(
                    _configuraton["JwtSettings:ExpirationTimeInMinutes"])),
                signingCredentials: GetSigningCredentials());
            return jwtOptions;
        }

        private async Task<List<Claim>> GetClaimsAsync(User user)
        {
            var claims = new List<Claim>()
            {
                new Claim(ClaimTypes.Name, user.Email)
            };

            foreach (var role in await _userManager.GetRolesAsync(user))
            {
                claims.Add(new Claim(ClaimTypes.Role, role.ToString()));
            }
            return claims;
        }

        private SigningCredentials GetSigningCredentials()
        {
            var key = Encoding.UTF8.GetBytes(_configuraton["JwtSettings:Key"]);
            var secret = new SymmetricSecurityKey(key);
            return new SigningCredentials(secret, SecurityAlgorithms.HmacSha256);
        }
    }
}