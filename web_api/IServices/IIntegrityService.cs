using Kviz.Service.DataTransferObjects;

namespace Kviz.Service.IServices
{
    public interface IIntegrityService
    {
        public Task<string?> GenerateIntegrityToken(string key, string issuer, string audience, int iex, UserDto user);
    }
}
