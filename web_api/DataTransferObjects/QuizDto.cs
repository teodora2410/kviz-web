namespace Kviz.Service.DataTransferObjects
{
    public class QuizDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Categories { get; set; }
        public int TimeLimit { get; set; }
        public string Level { get; set; }
        public bool IsDeleted { get; set; }
        public int OriginalQuizId { get; set; }

        public List<QuestionDto> Questions { get; set; } = [];

        public QuizDto()
        {
            Title = string.Empty;
            Description = string.Empty;
            Categories = string.Empty;
            Level = string.Empty;
        }

        public QuizDto(int id, string title, string description, string categories, int timeLimit, string level, bool isDeleted, int originalQuizId, List<QuestionDto> questions)
        {
            Id = id;
            Title = title;
            Description = description;
            Categories = categories;
            TimeLimit = timeLimit;
            Level = level;
            IsDeleted = isDeleted;
            OriginalQuizId = originalQuizId;
            Questions = questions;
        }
    }
}
