using Kviz.Service.DataTransferObjects;

namespace Kviz.Service.IServices
{
    public interface IQuizService
    {
        public Task<bool> AddQuiz(QuizDto data);
        public Task<QuizDto?> GetQuizById(int quizId);
        public Task<List<QuizDto>> GetAllQuizzess();
        public Task<bool> UpdateQuiz(int originalQuizId, QuizDto data);
        public Task<bool> DeleteQuiz(int id);
    }
}
