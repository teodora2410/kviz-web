using Kviz.Service.DataTransferObjects;
using Kviz.Service.IServices;
using Microsoft.IdentityModel.Tokens;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Kviz.Service.Services
{
    public class IntegrityService : IIntegrityService
    {
        public async Task<string?> GenerateIntegrityToken(string key, string issuer, string audience, int iex, UserDto user)
        {
            try
            {
                var credentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)), SecurityAlgorithms.HmacSha256);
                var token = new JwtSecurityToken(issuer: issuer, audience: audience,
                    claims: [new Claim("id", user.Id.ToString()), new Claim("email", user.Email), new Claim("role", user.IsAdmin ? "Admin" : "User")],
                    expires: DateTime.UtcNow.AddHours(iex), signingCredentials: credentials
                );

                return await Task.FromResult(new JwtSecurityTokenHandler().WriteToken(token));
            }
            catch (Exception e)
            {
                Trace.WriteLine(e.Message);
                return null;
            }
        }
    }
}
