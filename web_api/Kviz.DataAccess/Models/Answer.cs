namespace Kviz.DataAccess.Models
{
    public class Answer
    {
        public int Id { get; set; }
        public int QuizId { get; set; }
        public int QuestionId { get; set; }
        public string Text { get; set; }
        public bool Correct { get; set; }

        public Answer()
        {
            Text = string.Empty;
        }

        public Answer(int id, int quizId, int questionId, string text, bool correct)
        {
            Id = id;
            QuizId = quizId;
            QuestionId = questionId;
            Text = text;
            Correct = correct;
        }
    }
}
