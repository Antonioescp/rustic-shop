using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.EventLog;
using RusticShopAPI.Data;
using RusticShopAPI.Data.Models;
using RusticShopAPI.Services;

namespace RusticShopAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly JwtService _jwtService;
        private readonly IConfiguration _configuration;

        public UsersController(
            UserManager<User> userManager,
            JwtService jwtService,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _jwtService = jwtService;
            _configuration = configuration;
        }

        [HttpPost]
        public async Task<IActionResult> RegisterUser(
            RegistrationRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new User
            {
                UserName = request.UserName,
                Email = request.Email
            };
            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            result = await _userManager
                .AddToRoleAsync(user, _configuration["Roles:Cx"]);

            if (!result.Succeeded)
            {
                await _userManager.DeleteAsync(user);
                return StatusCode(500, result.Errors);
            }

            return CreatedAtAction(
                nameof(GetUser), 
                new { username = request.UserName},
                new
                {
                    UserName = request.UserName,
                    Email = request.Email
                });
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<User>> GetUser(string username)
        {
            User user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                return NotFound();
            }

            return new User
            {
                UserName = username,
                Email = user.Email
            };
        }

        [HttpPost("Login")]
        public async Task<ActionResult<LoginResponse>> Login(LoginRequest loginRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByEmailAsync(loginRequest.Email);

            if (user == null)
            {
                return BadRequest("Bad credentials");
            }

            var isPasswordValid = await _userManager.CheckPasswordAsync(user, loginRequest.Password);

            if (!isPasswordValid)
            {
                return BadRequest("Bad credentials");
            }

            var token = _jwtService.CreateToken(user);

            return Ok(token);
        }
    }
}
