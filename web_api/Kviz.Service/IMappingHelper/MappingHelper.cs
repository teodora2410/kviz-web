using AutoMapper;
using Kviz.DataAccess.Models;
using Kviz.Service.DataTransferObjects;

namespace Kviz.Service.IMappingHelper
{
    public class MappingHelper : Profile
    {
        public MappingHelper()
        {
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<Quiz, QuizDto>().ReverseMap();
            CreateMap<Question, QuestionDto>().ReverseMap();
            CreateMap<Answer, AnswerDto>().ReverseMap();
            CreateMap<Result, ResultDto>().ReverseMap();
            CreateMap<ResultAnswer, ResultAnswerDto>().ReverseMap();
        }
    }
}
