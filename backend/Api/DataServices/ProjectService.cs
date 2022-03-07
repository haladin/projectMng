using Api.Model;
using System.Text.Json;

namespace Api.DataServices;

public class ProjectService : IService<Project>
{
    public const string PATH = "Projects";
    public static readonly string fullPath = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, PATH));

    public ProjectService()
    {
    }


    public async Task Delete(string id)
    {
        var project = await Get(id);

        if (project != null)
        {
            if (project.Tasks != null && project.Tasks.Count > 0)
            {
                foreach (var taskId in project.Tasks)
                {                    
                    var rawData = await FileHelper.ReadAFiles(TaskService.fullPath, taskId);
                    var task = JsonSerializer.Deserialize<PTask>(rawData);
                    if (task != null)
                    {
                        if (task.History != null && task.History.Count > 0)
                        {
                            foreach (var historyEventId in task.History)
                            {
                                await FileHelper.DeleteFile(HistoryEventService.fullPath, historyEventId);
                            }
                        }
                    }

                    await FileHelper.DeleteFile(TaskService.fullPath, taskId);
                }
            }

            await FileHelper.DeleteFile(fullPath, id);
        }
    }

    public async Task<Project> Get(string id)
    {
        Project project = null;
        try
        {
            var rawData = await FileHelper.ReadAFiles(fullPath, id);

            project = JsonSerializer.Deserialize<Project>(rawData);

        }
        catch (Exception e)
        {
            Console.WriteLine("The process failed: {0}", e.ToString());
        }
        return project;
    }

    public async Task<List<Project>> GetAll()
    {
        var projects = new List<Project>();
        try
        {
            var rawData = await FileHelper.ReadAllFiles(fullPath);

            foreach (var file in rawData)
            {
                var prj = JsonSerializer.Deserialize<Project>(file);
                projects.Add(prj);
            }

        }
        catch (Exception e)
        {
            Console.WriteLine("The process failed: {0}", e.ToString());
        }
        return projects;
    }

    public Task<List<Project>> GetAllForAParent(string id)
    {
        throw new NotImplementedException();
    }

    public async Task<Project> Update(Project project)
    {
        if (project.Id == null)
        {
            // New project
            var id = FileHelper.CreateId(fullPath);
            project.Id = id;
            var projects = await GetAll();
            if (projects.Any( p => p.Name == project.Name))
            {
                throw new Exception($"Project with name '{project.Name}' already exists.");
            }
        }
        else
        {
            var oldProject = Get(project.Id);
            if (oldProject == null)
            {
                throw new Exception($"Project not found: {oldProject.Id}");
            }
        }

        var json = JsonSerializer.Serialize(project);
        var dict = new Dictionary<string, string>() {
                {project.Id, json}
            };
        await FileHelper.ProcessMulitpleWritesAsync(dict, fullPath);

        return project;
    }
}
