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
using NuGet.ProjectModel;
using RusticShopAPI.Data;
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

        /// <summary>
        /// Creates a new user account, with its default role to admin
        /// </summary>
        /// <param name="request">The user data</param>
        /// <returns>The operation result</returns>
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

            return CreatedAtAction(
                nameof(GetUser), 
                new { username = request.UserName },
                new
                {
                    UserData = UserDTO.From(user),
                    EmailSent = mailSent
                });
        }

        /// <summary>
        /// Gets the user given its username
        /// </summary>
        /// <param name="username">The user's username</param>
        /// <returns>The user's public data</returns>
        [HttpGet("{username}")]
        public async Task<ActionResult<UserDTO>> GetUser(string username)
        {
            User user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                return BadRequest();
            }

            return UserDTO.From(user);
        }

        /// <summary>
        /// Verifies user's information and logs in
        /// </summary>
        /// <param name="loginRequest">The user's login data</param>
        /// <returns>The status of the operation and a JWT if succeeded</returns>
        [HttpPost("Login")]
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

            var token = _jwtService.CreateToken(user);

            return Ok(token);
        }

        /// <summary>
        /// Updates the given user
        /// </summary>
        /// <param name="username">The user's username</param>
        /// <param name="userData">The user's new data</param>
        /// <returns>No content</returns>
        [HttpPut("{username}")]
        public async Task<IActionResult> DeleteUser(string username, UserDTO userData)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                return BadRequest();
            }

            user.UserName = userData.UserName;
            user.PhoneNumber = userData.PhoneNumber;
            user.FirstName = userData.FirstName;
            user.LastName = userData.LastName;
            user.IdentificationCardNumber = userData.IdentificationCardNumber;
            user.Email = userData.Email;
            user.UpdatedAt = DateTime.UtcNow;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return NoContent();
        }

        /// <summary>
        /// Deletes the given user
        /// </summary>
        /// <param name="username">The user's username</param>
        /// <returns>No Content</returns>
        [HttpDelete("{username}")]
        public async Task<IActionResult> DeleteUser(string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                return BadRequest();
            }

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return NoContent();
        }

        /// <summary>
        /// Sends a verification token to the user's email
        /// </summary>
        /// <param name="username">The user's username</param>
        /// <returns>Ok</returns>
        [HttpGet("{username}/send-email-confirmation")]
        public async Task<ActionResult<AuthenticationResponse>> SendConfirmationEmail(string username)
        {
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
            var confirmUrl = Request.Scheme + "://" + Request.Host
                + Url.Action("ConfirmEmail", "Users", new
                {
                    username,
                    token = emailToken
                });

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

        [HttpGet("auth/confirm-email")]
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
