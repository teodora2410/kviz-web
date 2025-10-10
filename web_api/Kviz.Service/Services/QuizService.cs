using AutoMapper;
using Kviz.DataAccess;
using Kviz.Domain;
using Kviz.Service.DataTransferObjects;
using Kviz.Service.IServices;
using System.Diagnostics;

namespace Kviz.Service.Services
{
    public class QuizService(IRepository<Quiz> QuizRepository, IRepository<Question> QuestionRepository, IRepository<Answer> AnswerRepository, IMapper mapper) : IQuizService
    {
        public async Task<bool> AddQuiz(QuizDto data)
        {
            try
            {
                Quiz quizData = mapper.Map<QuizDto, Quiz>(data);
                quizData.Id = 0;

                // originalQuizId will be managed on frontend via request

                Quiz? quiz = await QuizRepository.AddAsync(quizData);

                if (quiz == null)
                    return false;

                foreach (QuestionDto questionDto in data.Questions)
                {
                    Question question = mapper.Map<QuestionDto, Question>(questionDto);
                    question.Id = 0;
                    question.QuizId = quiz.Id;

                    // svako pitanje ima listu odgovora
                    Question? questionAdd = await QuestionRepository.AddAsync(question);

                    if (questionAdd == null)
                    {
                        // rollback add
                        await QuizRepository.DeleteByIdAsync(quiz.Id);
                        return false;
                    }

                    foreach (AnswerDto answer in questionDto.Answers)
                    {
                        Answer toAdd = mapper.Map<AnswerDto, Answer>(answer);
                        toAdd.Id = 0;
                        toAdd.QuizId = quiz.Id;
                        toAdd.QuestionId = question.Id;

                        Answer? addedAnswer = await AnswerRepository.AddAsync(toAdd);

                        if (addedAnswer == null)
                        {
                            // rollback add
                            await QuizRepository.DeleteByIdAsync(quiz.Id);
                            return false;
                        }
                    }
                }

                return true;
            }
            catch (Exception e)
            {
                Trace.WriteLine(e.Message);
                return false;
            }
        }

        public async Task<QuizDto?> GetQuizById(int quizId)
        {
            try
            {
                Quiz? quiz = await QuizRepository.GetByIdAsync(quizId);

                if (quiz == null)
                    return null;

                List<Question> questions = (await QuestionRepository.FindAsync(q => q.QuizId == quiz.Id)).ToList();
                List<Answer> answers = (await AnswerRepository.FindAsync(a => a.QuizId == quiz.Id)).ToList();

                QuizDto quizDto = mapper.Map<Quiz, QuizDto>(quiz);
                quizDto.Questions = mapper.Map<List<Question>, List<QuestionDto>>(questions);

                foreach (QuestionDto qdto in quizDto.Questions)
                {
                    var answersForQuestion = await AnswerRepository.FindAsync(q => q.QuestionId == qdto.Id);
                    qdto.Answers = mapper.Map<List<Answer>, List<AnswerDto>>(answersForQuestion.ToList());
                }

                return quizDto;
            }
            catch (Exception e)
            {
                Trace.WriteLine(e.Message);
                return null;
            }
        }

        public async Task<List<QuizDto>> GetAllQuizzess()
        {
            try
            {
                List<Quiz> quizzes = (await QuizRepository.FindAsync(q => q.IsDeleted == false)).ToList();
                List<QuizDto> quizesDto = [];

                foreach (Quiz q in quizzes)
                {
                    QuizDto? fetched = await GetQuizById(q.Id);

                    if (fetched != null)
                        quizesDto.Add(fetched);
                }

                return quizesDto;
            }
            catch (Exception e)
            {
                Trace.WriteLine(e.Message);
                return [];
            }
        }

        public async Task<bool> UpdateQuiz(int originalQuizId, QuizDto data)
        {
            try
            {
                Quiz? oldVersionQuiz = await QuizRepository.FirstOrDefaultAsync(q => q.Id == originalQuizId);

                if (oldVersionQuiz == null)
                    return false;

                oldVersionQuiz.IsDeleted = true;
                await QuizRepository.UpdateAsync(oldVersionQuiz);

                return await AddQuiz(data);
            }
            catch (Exception e)
            {
                Trace.WriteLine(e.Message);
                return false;
            }
        }

        public async Task<bool> DeleteQuiz(int id)
        {
            try
            {
                Quiz? quiz = await QuizRepository.FirstOrDefaultAsync(q => q.Id == id);

                if (quiz == null)
                    return false;

                quiz.IsDeleted = true;
                await QuizRepository.UpdateAsync(quiz);

                return true;
            }
            catch (Exception e)
            {
                Trace.WriteLine(e.Message);
                return false;
            }
        }
    }
}
