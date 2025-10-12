namespace Kviz.DataAccess.Models
{
    public class ResultAnswer
    {
        public int Id { get; set; }
        public int ResultId { get; set; }
        public int QuestionId { get; set; }
        public string UserAnswer { get; set; }

        public ResultAnswer()
        {
            UserAnswer = string.Empty;
        }

        public ResultAnswer(int id, int resultId, int questionId, string userAnswer)
        {
            Id = id;
            ResultId = resultId;
            QuestionId = questionId;
            UserAnswer = userAnswer;
        }
    }
}
