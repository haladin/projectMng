using Api.Model;
using Microsoft.AspNetCore.Mvc;
using Api.DataServices;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly IService<Project> _projectService;
        private readonly IService<PTask> _taskService;

        public ProjectController(IService<Project> projectService, IService<PTask> taskService)
        {
            _projectService = projectService;
            _taskService = taskService;
        }

        // GET: api/<ProjectController>
        [HttpGet]
        public async Task<IEnumerable<Project>> Get()
        {
            return await _projectService.GetAll();
        }

        // GET api/<ProjectController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> Get(string id)
        {
            var project = await _projectService.Get(id);
            if (project == null)
            {
                return NotFound();
            }

            return project;
        }

        [HttpGet("{id}/tasks")]
        public async Task<ActionResult<List<PTask>>> GetTasks(string id)
        {
            var project = await _projectService.Get(id);
            if (project == null)
            {
                return NotFound();
            }

            var tasks = new List<PTask>();
            if (project.Tasks != null)
            {
                foreach (var t in project.Tasks)
                {
                    var task = await _taskService.Get(t);
                    tasks.Add(task);
                }
            }

            return tasks;
        }

        // POST api/<ProjectController>
        [HttpPost]
        public async Task<ActionResult<Project>> Post([FromBody] Project project)
        {
            if (project == null || string.IsNullOrEmpty(project.Name))
            {
                return BadRequest();
            }

            return await _projectService.Update(project);
        }

        // DELETE api/<ProjectController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest();
            }
            await _projectService.Delete(id);
            return Ok();
        }
    }
}
