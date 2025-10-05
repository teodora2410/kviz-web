namespace Kviz.Service.DataTransferObjects
{
    public class LoginDto
    {
        public string Username { get; set; }
        public string Password { get; set; }

        public LoginDto()
        {
            Username = string.Empty;
            Password = string.Empty;
        }

        public LoginDto(string username, string password)
        {
            Username = username;
            Password = password;
        }
    }
}
