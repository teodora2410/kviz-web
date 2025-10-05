namespace Kviz.Service.DataTransferObjects
{
    public class ResultAnswerDto
    {
        public int Id { get; set; }
        public int ResultId { get; set; }
        public int QuestionId { get; set; }
        public string UserAnswer { get; set; }

        public ResultAnswerDto()
        {
            UserAnswer = string.Empty;
        }

        public ResultAnswerDto(int id, int resultId, int questionId, string userAnswer)
        {
            Id = id;
            ResultId = resultId;
            QuestionId = questionId;
            UserAnswer = userAnswer;
        }
    }
}
