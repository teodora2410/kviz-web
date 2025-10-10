namespace Kviz.Service.DataTransferObjects
{
    public class QuestionDto
    {
        public int Id { get; set; }
        public int QuizId { get; set; }
        public string Title { get; set; }
        public int Type { get; set; }

        public List<AnswerDto> Answers { get; set; } = [];

        public QuestionDto()
        {
            Title = string.Empty;
        }

        public QuestionDto(int id, int quizId, string title, int type, List<AnswerDto> answers)
        {
            Id = id;
            QuizId = quizId;
            Title = title;
            Type = type;
            Answers = answers;
        }
    }
}
