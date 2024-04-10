using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RusticShopAPI.Data.Models;
using RusticShopAPI.Services;
using RusticShopAPI.Services.Mail;
using System.Linq;
using RusticShopAPI.Data.Models.Auth;
using RusticShopAPI.Data.Models.DTOs;

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
        public async Task<ActionResult<RegistrationResponse>> RegisterUser(RegistrationRequest request)
        {
            var user = new User
            {
                UserName = request.UserName,
                Email = request.Email
            };
            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                var response = new RegistrationResponse
                {
                    Success = false,
                    Message = "Han ocurrido algunos errores",
                    Errors = result.Errors.Select(error => error.Description).ToList(),
                    EmailSent = false
                };
                return BadRequest(response);
            }

            result = await _userManager
                .AddToRoleAsync(user, _configuration["Roles:Cx"]);

            if (!result.Succeeded)
            {
                await _userManager.DeleteAsync(user);

                var response = new RegistrationResponse
                {
                    Success = false,
                    Message = "Han ocurrido algunos errores",
                    Errors = result.Errors.Select(error => error.Description).ToList(),
                    EmailSent = false
                };
                return BadRequest(response);
            }

            _ = SendConfirmationEmail(user);

            return Ok(new RegistrationResponse
            {
                Success = true,
                Message = $"Registrado con éxito",
            });
        }

        [HttpPost("auth/login")]
        public async Task<ActionResult<AuthenticationResponse>> Login(LoginRequest loginRequest)
        {
            var user = await _userManager.FindByEmailAsync(loginRequest.Email);
            if (user == null)
            {
                return BadRequest(new AuthenticationResponse
                {
                    Success = false,
                    Message = "Correo electronico o contraseña invalida"
                });
            }

            if (await _userManager.IsLockedOutAsync(user))
            {
                return Unauthorized(new AuthenticationResponse
                {
                    Success = false,
                    Message = "Tu cuenta ha sido bloqueada por demasiados intentos de inicio de sesión."
                });
            }

            if (!await _userManager.CheckPasswordAsync(user, loginRequest.Password))
            {
                await _userManager.AccessFailedAsync(user);

                return BadRequest(new AuthenticationResponse
                {
                    Success = false,
                    Message = "Correo electronico o contraseña invalida"
                });
            }

            var token = await _jwtHandler.GetTokenAsync(user);
            var secToken = new JwtSecurityTokenHandler().WriteToken(token);

            await _userManager.ResetAccessFailedCountAsync(user);

            return Ok(new AuthenticationResponse
            {
                Success = true,
                Token = secToken,
                Message = "Inicio de sesion correcto"
            });
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
            result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest();
            }

            return Ok();
        }

        [HttpPost("auth/request-password-reset")]
        public async Task<IActionResult> RequestPasswordReset(PasswordResetRequest passwordResetRequest)
        {
            var user = await _userManager.FindByEmailAsync(passwordResetRequest.Email);
            if (user == null)
            {
                return Unauthorized();
            }

            var passwordResetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
            if (passwordResetToken == null)
            {
                return StatusCode(500);
            }

            var passwordResetUrl = Url.Action(
                nameof(ResetPassword),
                "Users",
                new
                {
                    Username = user.UserName,
                    Token = passwordResetToken
                },
                Request.Scheme,
                Request.Host.Value)?.Replace("api/", "");

            if (passwordResetToken == null)
            {
                return StatusCode(500);
            }

            var mailResult = await _mailService.SendEmailTemplateAsync(new MailData
            {
                EmailSubject = "Restablecimiento de contraseña",
                EmailToId = user.Email,
                EmailToName = user.Email
            }, "ResetPassword", user.UserName, passwordResetUrl);

            if (!mailResult)
            {
                return StatusCode(500);
            }

            return Ok();
        }

        [HttpPost("auth/reset-password")]
        public async Task<IActionResult> ResetPassword(
            PasswordResetData data)
        {
            var user = await _userManager.FindByNameAsync(data.Username);
            if (user == null)
            {
                return NotFound();
            }

            var result = await _userManager.ResetPasswordAsync(user, data.Token, data.Password);
            if (!result.Succeeded)
            {
                return Unauthorized(result.Errors);
            }

            var url = Url.Action(
                nameof(Login),
                "Users",
                null,
                Request.Scheme,
                Request.Host.Value
                )?.Replace("api/", user.UserName);

            await _mailService.SendEmailTemplateAsync(new MailData
            {
                EmailSubject = "Restablecimiento contraseña exitoso",
                EmailToId = user.Email,
                EmailToName = user.Email
            }, "PasswordReseted", user.UserName, url);

            return Ok();
        }

        [HttpPost("auth/request-account-unlock")]
        public async Task<IActionResult> RequestAccountUnlock(AccountUnlockRequest data)
        {
            var user = await _userManager.FindByEmailAsync(data.Email);
            if (user == null)
            {
                return Ok();
            }

            if (!await _userManager.IsLockedOutAsync(user))
            {
                return BadRequest();
            }

            var token = await _userManager.GenerateUserTokenAsync(
                user,
                TokenOptions.DefaultProvider,
                "UnlockAccount");

            if (token == null)
            {
                return StatusCode(500);
            }

            var url = Url.Action(
                nameof(UnlockAccount),
                "Users",
                new
                {
                    Username = user.UserName,
                    Token = token
                },
                Request.Scheme,
                Request.Host.Value)?.Replace("api/", "");

            if (url == null)
            {
                return StatusCode(500);
            }

            var emailSent = await _mailService.SendEmailTemplateAsync(new MailData
            {
                EmailSubject = "Desbloqueo de cuenta",
                EmailToId = user.Email,
                EmailToName = user.Email
            }, "AccountUnlockRequest", user.UserName, url);

            if (emailSent)
            {
                return Ok();
            }
            else
            {
                return StatusCode(500);
            }
        }

        [HttpPost("auth/unlock-account")]
        public async Task<IActionResult> UnlockAccount(
            AccountUnlockData data)
        {
            var user = await _userManager.FindByNameAsync(data.Username);
            if (user == null)
            {
                return BadRequest();
            }

            if (await _userManager.VerifyUserTokenAsync(user, TokenOptions.DefaultProvider, "UnlockAccount", data.Token))
            {
                await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.UtcNow);
                return Ok();
            }
            else
            {
                return Unauthorized();
            }
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
        public async Task<ActionResult<UserDTO>> UpdateAccount(UserUpdateRequest updatedData)
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

        [HttpPost("email-availability")]
        public async Task<bool> CheckEmailAvailability(EmailOnlyDto data)
        {
            var user = await _userManager.FindByEmailAsync(data.Email);
            return user == null;
        }

        [HttpPost("username-availability")]
        public async Task<bool> CheckUserNameAvailability(UserNameOnlyDto data)
        {
            var user = await _userManager.FindByNameAsync(data.Username);
            return user == null;
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

