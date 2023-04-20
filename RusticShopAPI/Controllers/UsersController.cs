using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RusticShopAPI.Data.Models.Users;
using RusticShopAPI.Services;
using RusticShopAPI.Services.Mail;

namespace RusticShopAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly JwtHandler _jwtHandler;
        private readonly IConfiguration _configuration;
        private readonly IMailService _mailService;

        public UsersController(
            UserManager<User> userManager,
            JwtHandler jwtHandler,
            IConfiguration configuration,
            IMailService mailService)
        {
            _userManager = userManager;
            _jwtHandler = jwtHandler;
            _configuration = configuration;
            _mailService = mailService;
        }

        [HttpPost]
        public async Task<IActionResult> RegisterUser(RegistrationRequest request)
        {
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
                return BadRequest(result.Errors);
            }

            var mailSent = await SendConfirmationEmail(user);

            return Ok(new 
            {
                UserData = UserDTO.From(user),
                EmailSent = mailSent
            });
        }

        [HttpPost("auth/login")]
        public async Task<ActionResult<AuthenticationResponse>> Login(LoginRequest loginRequest)
        {
            var user = await _userManager.FindByEmailAsync(loginRequest.Email);
            if (user == null
                || !await _userManager.CheckPasswordAsync(user, loginRequest.Password))
            {
                return Unauthorized(new AuthenticationResponse
                {
                    Success = false,
                    Message = "Correo electronico o contraseña invalida"
                });
            }

            var token = await _jwtHandler.GetTokenAsync(user);
            var secToken = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new AuthenticationResponse
            {
                Success = true,
                Token = secToken,
                Message = "Inicio de sesion correcto"
            });
        }

        [Authorize]
        [HttpGet("account")]
        public async Task<ActionResult<UserDTO>> GetAccount()
        {
            var username = HttpContext.User.Claims.First(c => c.Type == ClaimTypes.Name).Value;
            if (username == null)
            {
                return Unauthorized();
            }

            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                return Unauthorized();
            }

            return Ok(UserDTO.From(user));
        }

        [Authorize]
        [HttpDelete("account")]
        public async Task<IActionResult> DeleteAccount()
        {
            var username = HttpContext.User.Claims.First(c => c.Type == ClaimTypes.Name).Value;
            if (username == null)
            {
                return Unauthorized();
            }

            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                return BadRequest();
            }

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest();
            }

            return NoContent();
        }

        [Authorize]
        [HttpPut("account")]
        public async Task<ActionResult<UserDTO>> UpdateAccount(UpdateRequest updatedData)
        {
            var username = HttpContext.User.Claims.First(c => c.Type == ClaimTypes.Name).Value;
            if (username == null)
            {
                return Unauthorized();
            }

            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                return Unauthorized();
            }

            user.IdentificationCardNumber = updatedData.IdentificationCardNumber;
            user.FirstName = updatedData.FirstName;
            user.LastName = updatedData.LastName;
            user.PhoneNumber = updatedData.PhoneNumber;
            user.UpdatedAt = DateTime.UtcNow;
            user.SecurityStamp = Guid.NewGuid().ToString();

            if (user.Email != updatedData.Email)
            {
                user.EmailConfirmed = false;
                user.Email = updatedData.Email;
            }

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            if (!user.EmailConfirmed)
            {
                await SendConfirmationEmail(user);
            }

            return Ok(UserDTO.From(user));
        }

        [Authorize]
        [HttpPost("auth/send-email-confirmation")]
        public async Task<ActionResult<AuthenticationResponse>> RequestEmailConfirmation()
        {
            var username = HttpContext.User.Claims.First(c => c.Type == ClaimTypes.Name).Value;
            if (username == null)
            {
                return Unauthorized();
            }

            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                return BadRequest(new AuthenticationResponse
                {
                    Success = false,
                    Message = "Bad credentials"
                });
            }

            var mailSent = await SendConfirmationEmail(user);

            if (mailSent)
            {
                return Ok();
            } 
            else
            {
                return BadRequest();
            }
        }

        [HttpPost("auth/confirm-email")]
        public async Task<IActionResult> ConfirmEmail([FromQuery] string username, [FromQuery] string token)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                return BadRequest();
            }

            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            user.EmailConfirmed = true;
            user.UpdatedAt = DateTime.UtcNow;
            result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest();
            }

            return Ok();
        }

        private async Task<bool> SendConfirmationEmail(User user)
        {
            var emailToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var confirmationUrl = Url.Action(
                nameof(ConfirmEmail),
                "Users",
                new { user.UserName, Token = emailToken },
                Request.Scheme,
                Request.Host.Value)?.Replace("api/", "");

            return await _mailService.SendEmailTemplateAsync(new MailData
            {
                EmailSubject = "Confirmación de correo",
                EmailToId = user.Email,
                EmailToName = user.Email
            }, "ConfirmAccount", user.UserName, confirmationUrl);
        }

        #region AdminCRUD

        [Authorize(Roles = "Administrator")]
        [HttpGet]
        public async Task<ActionResult<User[]>> GetUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            if (users == null)
            {
                return BadRequest();
            }

            return Ok(users);
        }

        [Authorize(Roles = "Administrator")]
        [HttpGet("{username}")]
        public async Task<ActionResult<User>> GetUser(string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [Authorize(Roles = "Administrator")]
        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateUser(string userId, User user)
        {
            if (userId != user.Id)
            {
                return BadRequest();
            }

            var oldUser = await _userManager.FindByIdAsync(userId);
            if (oldUser.Email != user.Email)
            {
                oldUser.EmailConfirmed = false;
            }

            oldUser.UserName = user.UserName;
            oldUser.PhoneNumber = user.PhoneNumber;
            oldUser.FirstName = user.FirstName;
            oldUser.LastName = user.LastName;
            oldUser.Email = user.Email;
            oldUser.UpdatedAt = DateTime.UtcNow;
            oldUser.IdentificationCardNumber = user.IdentificationCardNumber;
            oldUser.SecurityStamp = Guid.NewGuid().ToString();

            var result = await _userManager.UpdateAsync(oldUser);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError("", error.Description);
                    return BadRequest(ModelState);
                }
            }

            await SendConfirmationEmail(oldUser);

            return NoContent();
        }

        [Authorize(Roles = "Administrator")]
        [HttpDelete("{username}")]
        public async Task<IActionResult> DeleteUser(string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                return NotFound();
            }

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError("", error.Description);
                }

                return BadRequest(ModelState);
            }

            return NoContent();
        }

        #endregion
    }
}
