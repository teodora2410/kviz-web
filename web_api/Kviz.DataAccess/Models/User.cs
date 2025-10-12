namespace Kviz.DataAccess.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string ProfileImage { get; set; }
        public bool IsAdmin { get; set; }

        public User()
        {
            Username = string.Empty;
            Email = string.Empty;
            Password = string.Empty;
            ProfileImage = string.Empty;
        }

        public User(int id, string username, string email, string password, string profileImage, bool isAdmin)
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
