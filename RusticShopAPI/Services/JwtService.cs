using Microsoft.IdentityModel.Tokens;
using RusticShopAPI.Data.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RusticShopAPI.Services
{
    public class JwtService
    {
        private readonly IConfiguration _configuration;

        public JwtService(IConfiguration configuration) 
        {
            _configuration = configuration;
        }

        public LoginResponse CreateToken(User user)
        {
            var expiration = DateTime.Now.AddMinutes(Convert.ToDouble(
                _configuration["JwtSettings:ExpirationInMinutes"]));

            var token = CreateJwtToken(
                CreateClaims(user),
                CreateSigningCredentials(),
                expiration);

            var tokenHandler = new JwtSecurityTokenHandler();

            return new LoginResponse
            {
                Success = true,
                Message = "Autenticación con éxito",
                Token = tokenHandler.WriteToken(token),
                Expiration = expiration
            };
        }

        private JwtSecurityToken CreateJwtToken(Claim[] claims, SigningCredentials signingCredentials, DateTime expiration)
        {
            return new JwtSecurityToken(
                _configuration["JwtSettings:Issuer"],
                _configuration["JwtSettings:Audience"],
                claims,
                expires: expiration,
                signingCredentials: signingCredentials);
        }

        private SigningCredentials CreateSigningCredentials()
        {
            return new SigningCredentials(new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"]!)),
                SecurityAlgorithms.HmacSha256);
        }

        private Claim[] CreateClaims(User request)
        {
            return new Claim[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, 
                    _configuration["JwtSettings:Subject"]!),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
                new Claim(ClaimTypes.Email, request.Email),
                new Claim(ClaimTypes.Name, request.UserName),
                new Claim(ClaimTypes.NameIdentifier, request.Id)
            };
        }
    }
}
