namespace Kviz.Service.DataTransferObjects
{
    public class ResultDto
    {
        public int Id { get; set; }
        public int QuizId { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; }
        public DateTime SolvedAt { get; set; }
        public QuizDto QuizDto { get; set; }
        public List<ResultAnswerDto> UserAnswers { get; set; } = [];

        public ResultDto()
        {
            Username = string.Empty;
            QuizDto = new QuizDto();
        }

        public ResultDto(int id, int quizId, int userId, string username, DateTime solvedAt, QuizDto quizDto, List<ResultAnswerDto> userAnswers)
        {
            Id = id;
            QuizId = quizId;
            UserId = userId;
            Username = username;
            SolvedAt = solvedAt;
            QuizDto = quizDto;
            UserAnswers = userAnswers;
        }
    }
}
