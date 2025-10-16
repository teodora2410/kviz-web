using Kviz.Service.DataTransferObjects;
using Kviz.Service.IServices;
using Microsoft.AspNetCore.Mvc;

namespace Kviz.API.Controllers
{
    [Route("api/v1/auth")]
    [ApiController]
    public class AuthentificationController(IConfiguration Configuration, IAuthentificationService AuthService, IIntegrityService IntegrityService) : ControllerBase
    {
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto data)
        {
            (bool success, UserDto user) = await AuthService.Login(data.Username, data.Password);

            if (!success)
                return Unauthorized("Invalid credentials.");
            else
            {
                var token = await GenerateToken(user);
                return Ok(new { token, user });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserDto userDto)
        {
            (bool success, UserDto user) = await AuthService.Register(userDto);

            if (!success)
                return Unauthorized("Email or username in use.");
            else
            {
                var token = await GenerateToken(user);
                return Ok(new { token, user });
            }
        }

        private async Task<string?> GenerateToken(UserDto user)
        {
            string key = Configuration["SystemIntegrityToken:key"] ?? "0";
            string issuer = Configuration["SystemIntegrityToken:issuer"] ?? "0";
            string audience = Configuration["SystemIntegrityToken:audience"] ?? "0";
            int expiry = int.TryParse(Configuration["SystemIntegrityToken:iex"], out var iex) ? iex : 3600;

            return await IntegrityService.GenerateIntegrityToken(key, issuer, audience, expiry, user);
        }
    }
}
