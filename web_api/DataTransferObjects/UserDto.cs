namespace Kviz.Service.DataTransferObjects
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string ProfileImage { get; set; }
        public bool IsAdmin { get; set; }

        public UserDto()
        {
            Username = string.Empty;
            Email = string.Empty;
            Password = string.Empty;
            ProfileImage = string.Empty;
        }

        public UserDto(int id, string username, string email, string password, string profileImage, bool isAdmin)
        {
            Id = id;
            Username = username;
            Email = email;
            Password = password;
            ProfileImage = profileImage;
            IsAdmin = isAdmin;
        }
    }
}
