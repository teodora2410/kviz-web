using Kviz.Service.DataTransferObjects;

namespace Kviz.Service.IServices
{
    public interface IResultService
    {
        public Task<bool> RecordNewResult(ResultDto data);
        public Task<List<ResultDto>> GetAllResult();
    }
}
