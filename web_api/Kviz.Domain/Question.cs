namespace Kviz.Domain
{
    public class Question
    {
        public int Id { get; set; }
        public int QuizId { get; set; }
        public string Title { get; set; }
        public int Type { get; set; }

        public Question()
        {
            Title = string.Empty;
        }

        public Question(int id, int quizId, string title, int type)
        {
            Id = id;
            QuizId = quizId;
            Title = title;
            Type = type;
        }
    }
}
