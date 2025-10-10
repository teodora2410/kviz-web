using Kviz.Service.DataTransferObjects;
using Kviz.Service.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kviz.API.Controllers
{
    [Route("api/v1/results")]
    [ApiController]
    public class ResultController(IResultService ResultService) : ControllerBase
    {
        [HttpPost("record")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> RecordResult(ResultDto result)
        {
            var success = await ResultService.RecordNewResult(result);
            if (!success)
                return BadRequest("Failed to record result");
            return Ok();
        }

        [HttpGet]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> GetAll()
        {
            var results = await ResultService.GetAllResult();
            return Ok(results);
        }
    }
}
