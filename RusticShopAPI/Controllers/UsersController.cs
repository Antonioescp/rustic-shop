using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RusticShopAPI.Data.Models;
using RusticShopAPI.Services;
using RusticShopAPI.Services.Mail;

namespace RusticShopAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly JwtService _jwtService;
        private readonly IConfiguration _configuration;
        private readonly IMailService _mailService;

        public UsersController(
            UserManager<User> userManager,
            JwtService jwtService,
            IConfiguration configuration,
            IMailService mailService)
        {
            _userManager = userManager;
            _jwtService = jwtService;
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

            var emailToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var confirmUrl = $"{Request.Scheme}://{Request.Host}" + Url.Action(
                "ConfirmEmail",
                "Users",
                new
                {
                    user.UserName,
                    Token = emailToken
                });
            var mailSent = await _mailService.SendEmailTemplateAsync(new MailData
            {
                EmailSubject = "Confirmación de cuenta",
                EmailToId = request.Email,
                EmailToName = request.UserName
            }, "ConfirmAccount", confirmUrl);

            return Ok(new 
            {
                UserData = UserDTO.From(user),
                EmailSent = mailSent
            });
        }

        [HttpPost("auth/login")]
        public async Task<ActionResult<AuthenticationResponse>> Login(LoginRequest loginRequest)
        {
            if (!ModelState.IsValid)
            {
                return new AuthenticationResponse
                {
                    Success = false,
                    Message = "Correo o contraseña equivocada"
                };
            }

            var user = await _userManager.FindByEmailAsync(loginRequest.Email);
            if (user == null
                || !await _userManager.CheckPasswordAsync(user, loginRequest.Password))
            {
                return new AuthenticationResponse
                {
                    Success = false,
                    Message = "Correo o contraseña equivocada"
                };
            }

            var authResponse = _jwtService.CreateToken(user);

            return Ok(authResponse);
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
        [HttpPost("auth/send-email-confirmation")]
        public async Task<ActionResult<AuthenticationResponse>> SendConfirmationEmail()
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

            var emailToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var confirmUrl = Url.Action(
                nameof(ConfirmEmail),
                "Users",
                new { username = user.UserName, token = emailToken },
                Request.Scheme,
                Request.Host.Value)?.Replace("api/", "");

            var mailSent = await _mailService.SendEmailTemplateAsync(new MailData
            {
                EmailSubject = "Confirmar cuenta",
                EmailToId = user.Email,
                EmailToName = user.UserName
            }, "ConfirmAccount", confirmUrl);

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
    }
}
