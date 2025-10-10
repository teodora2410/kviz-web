using Kviz.Service.DataTransferObjects;

namespace Kviz.Service.IServices
{
    public interface IAuthentificationService
    {
        public Task<(bool success, UserDto user)> Login(string username, string password);
        public Task<(bool success, UserDto user)> Register(UserDto _user);
    }
}
