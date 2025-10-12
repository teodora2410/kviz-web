namespace Kviz.DataAccess.Models
{
    public class Result
    {
        public int Id { get; set; }
        public int QuizId { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; }
        public DateTime SolvedAt { get; set; }

        public Result()
        {
            Username = string.Empty;
        }

        public Result(int id, int quizId, int userId, string username, DateTime solvedAt)
        {
            Id = id;
            QuizId = quizId;
            UserId = userId;
            Username = username;
            SolvedAt = solvedAt;
        }
    }
}
