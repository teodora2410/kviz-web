using Kviz.Service.DataTransferObjects;
using Kviz.Service.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kviz.API.Controllers
{
    [Route("api/v1/quizzes")]
    [ApiController]
    public class QuizController(IQuizService quizService) : ControllerBase
    {
        private readonly IQuizService _quizService = quizService;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var quizzes = await _quizService.GetAllQuizzess();
            return Ok(quizzes);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var quiz = await _quizService.GetQuizById(id);
            if (quiz == null)
                return NotFound();

            return Ok(quiz);
        }

        [HttpPost("create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(QuizDto quizDto)
        {
            var success = await _quizService.AddQuiz(quizDto);
            if (!success)
                return BadRequest();

            return Ok();
        }

        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] QuizDto quizDto)
        {
            var success = await _quizService.UpdateQuiz(id, quizDto);
            if (!success)
                return NotFound();

            return Ok();
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _quizService.DeleteQuiz(id);
            if (!success)
                return NotFound();

            return Ok();
        }
    }
}
