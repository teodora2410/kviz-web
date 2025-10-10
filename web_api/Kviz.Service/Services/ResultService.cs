using AutoMapper;
using Kviz.DataAccess;
using Kviz.Domain;
using Kviz.Service.DataTransferObjects;
using Kviz.Service.IServices;
using System.Diagnostics;

namespace Kviz.Service.Services
{
    public class ResultService(IRepository<Result> ResultRepository, IRepository<ResultAnswer> ResultAnswerRepository, IQuizService QuizService, IMapper mapper) : IResultService
    {
        public async Task<List<ResultDto>> GetAllResult()
        {
            try
            {
                List<ResultDto> results = [];
                List<Result> allResults = (await ResultRepository.GetAllAsync()).ToList();

                foreach (Result result in allResults)
                {
                    ResultDto resDto = mapper.Map<Result, ResultDto>(result);
                    resDto.QuizDto = (await QuizService.GetQuizById(resDto.QuizId)) ?? new();
                    resDto.UserAnswers = mapper.Map<List<ResultAnswer>, List<ResultAnswerDto>>((await ResultAnswerRepository.FindAsync(ra => ra.ResultId == resDto.Id)).ToList());
                    results.Add(resDto);
                }

                return results;
            }
            catch (Exception e)
            {
                Trace.WriteLine(e.Message);
                return [];
            }
        }

        public async Task<bool> RecordNewResult(ResultDto data)
        {
            try
            {
                Result result = mapper.Map<ResultDto, Result>(data);
                result.Id = 0;
                result.SolvedAt = DateTime.Now;

                Result? toAdd = await ResultRepository.AddAsync(result);

                if (toAdd == null)
                    return false;

                foreach (ResultAnswerDto resAnsDto in data.UserAnswers)
                {
                    ResultAnswer ra = mapper.Map<ResultAnswerDto, ResultAnswer>(resAnsDto);
                    ra.ResultId = toAdd.Id;

                    await ResultAnswerRepository.AddAsync(ra);
                }

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
