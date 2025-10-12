using AutoMapper;
using Kviz.DataAccess;
using Kviz.DataAccess.Models;
using Kviz.Service.DataTransferObjects;
using Kviz.Service.IServices;
using System.Diagnostics;
using System.Text;

namespace Kviz.Service.Services
{
    public class AuthentificationService(IRepository<User> Repository, IMapper mapper) : IAuthentificationService
    {
        private readonly (bool success, UserDto user) errorReturnObject = (false, new UserDto());

        public async Task<(bool success, UserDto user)> Login(string username, string password)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
                    return errorReturnObject;

                string hashPassword = Convert.ToBase64String(Encoding.UTF8.GetBytes(password));
                User? user = await Repository.FirstOrDefaultAsync(u => u.Username == username && u.Password == hashPassword);

                if (user == null)
                    return errorReturnObject;
                else
                    return (true, mapper.Map<User, UserDto>(user));

            }
            catch (Exception e)
            {
                Trace.WriteLine(e.Message);
                return errorReturnObject;
            }
        }

        public async Task<(bool success, UserDto user)> Register(UserDto _user)
        {
            try
            {
                User userDb = mapper.Map<UserDto, User>(_user);
                userDb.Id = 0;
                userDb.Password = Convert.ToBase64String(Encoding.UTF8.GetBytes(_user.Password));

                await Repository.AddAsync(userDb);

                User? user = await Repository.FirstOrDefaultAsync(u => u.Username == _user.Username);

                if (user == null)
                    return errorReturnObject;
                else
                    return (true, mapper.Map<User, UserDto>(user));

            }
            catch (Exception e)
            {
                Trace.WriteLine(e.Message);
                return errorReturnObject;
            }
        }
    }
}
