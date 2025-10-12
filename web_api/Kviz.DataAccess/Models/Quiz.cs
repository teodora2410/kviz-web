namespace Kviz.DataAccess.Models
{
    public class Quiz
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Categories { get; set; }
        public int TimeLimit { get; set; }
        public string Level { get; set; }
        public bool IsDeleted { get; set; }
        public int OriginalQuizId { get; set; }

        public Quiz()
        {
            Title = string.Empty;
            Description = string.Empty;
            Categories = string.Empty;
            Level = string.Empty;
        }

        public Quiz(int id, string title, string description, string categories, int timeLimit, string level, bool isDeleted, int originalQuizId)
        {
            Id = id;
            Title = title;
            Description = description;
            Categories = categories;
            TimeLimit = timeLimit;
            Level = level;
            IsDeleted = isDeleted;
            OriginalQuizId = originalQuizId;
        }
    }
}
