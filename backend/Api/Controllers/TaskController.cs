using Api.DataServices;
using Api.Model;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly IService<HistoryEvent> _historyService;
        private readonly IService<PTask> _taskService;

        public TaskController(IService<HistoryEvent> historyService, IService<PTask> taskService)
        {
            _historyService = historyService;
            _taskService = taskService;
        }


        // GET: api/<TaskController>
        [HttpGet]
        public async Task<IEnumerable<PTask>> Get()
        {
            return await _taskService.GetAll();
        }

        // GET api/<TaskController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PTask>> Get(string id)
        {
            var task = await _taskService.Get(id);
            if (task == null)
            {
                return NotFound();
            }

            return task;
        }

        [HttpGet("{id}/history")]
        public async Task<ActionResult<List<HistoryEvent>>> GetHistory(string id)
        {
            var task = await _taskService.Get(id);
            if (task == null)
            {
                return NotFound();
            }

            var events = new List<HistoryEvent>();
            if (task.History != null) {
                foreach (var e in task.History)
                {
                    var hEvent = await _historyService.Get(e);
                    events.Add(hEvent);
                }
            }

            return events;
        }

        // POST api/<TaskController>
        [HttpPost]
        public async Task<ActionResult<PTask>> Post([FromBody] PTask task)
        {
            if (task == null || string.IsNullOrEmpty(task.ProjectId))
            {
                return BadRequest();
            }
            
            return await _taskService.Update(task);
        }


        // DELETE api/<TaskController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest();
            }
            await _taskService.Delete(id);
            return Ok();
        }
    }
}
