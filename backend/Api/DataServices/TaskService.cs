using Api.Model;
using System.Text.Json;

namespace Api.DataServices;

public class TaskService : IService<PTask>
{
    private readonly IService<Project> _projectService;
    private readonly IService<HistoryEvent> _historyEventsService;
    public const string PATH = "Tasks";
    public static readonly string fullPath = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, PATH));

    public TaskService(IService<Project> projectService, IService<HistoryEvent> historyEventsService)
    {
        _projectService = projectService;
        _historyEventsService = historyEventsService;
    }

    public async Task Delete(string id)
    {
        var task = await Get(id);

        if (task != null)
        {
            if (task.History != null && task.History.Count > 0)
            {
                foreach (var historyEvent in task.History)
                {
                    await FileHelper.DeleteFile(HistoryEventService.fullPath, historyEvent);
                }
            }

            await FileHelper.DeleteFile(fullPath, id);
            var project = await _projectService.Get(task.ProjectId);

            if (project == null)
            {
                throw new Exception($"Project not found: {task.ProjectId}");
            }
            if (project.Tasks == null)
            {
                return;
            }

            project.Tasks.Remove(task.Id);
            await _projectService.Update(project);
        }
    }

    public async Task<PTask> Get(string id)
    {
        PTask task = null;
        try
        {
            var rawData = await FileHelper.ReadAFiles(fullPath, id);

            task = JsonSerializer.Deserialize<PTask>(rawData);

        }
        catch (Exception e)
        {
            Console.WriteLine("The process failed: {0}", e.ToString());
        }
        return task;
    }

    public async Task<List<PTask>> GetAll()
    {
        var tasks = new List<PTask>();
        try
        {
            var rawData = await FileHelper.ReadAllFiles(fullPath);

            foreach (var file in rawData)
            {
                var task = JsonSerializer.Deserialize<PTask>(file);
                tasks.Add(task);
            }
        }
        catch (Exception e)
        {
            Console.WriteLine("The process failed: {0}", e.ToString());
        }

        return tasks;
    }

    public async Task<List<PTask>> GetAllForAParent(string id)
    {
        var tasks = new List<PTask>();
        try
        {
            var rawData = await FileHelper.ReadAllFiles(fullPath);

            foreach (var file in rawData)
            {
                var task = JsonSerializer.Deserialize<PTask>(file);
                tasks.Add(task);
            }
        }
        catch (Exception e)
        {
            Console.WriteLine("The process failed: {0}", e.ToString());
        }

        return tasks.FindAll(t => t.ProjectId == id);
    }

    public async Task<PTask> Update(PTask task)
    {
        if (task.Id == null)
        {
            // New project
            var id = FileHelper.CreateId(fullPath);
            task.Id = id;
            task.CreatedAt = DateTimeHelper.GetCurrentTimestamp();

            var project = await _projectService.Get(task.ProjectId);
            if (project == null)
            {
                throw new Exception($"Project not found: {task.ProjectId}");
            }
            if (project.Tasks == null)
            {
                project.Tasks = new List<string>();
            }

            project.Tasks.Add(task.Id);
            await _projectService.Update(project);
        }
        else
        {
            var oldTask = await Get(task.Id);
            if (oldTask == null)
            {
                throw new Exception($"Task not found: {oldTask.Id}");
            }
            var diffs = GetDiff(oldTask, task);

            if (task.History == null)
            {
                task.History = new List<string>();
            }
            foreach (var diff in diffs)
            {
                var hEvent = await _historyEventsService.Update(diff);
                task.History.Add(hEvent.Id);
            }

            task.CreatedAt = oldTask.CreatedAt;
        }

        var json = JsonSerializer.Serialize(task);
        var dict = new Dictionary<string, string>() {
                {task.Id, json}
            };
        await FileHelper.ProcessMulitpleWritesAsync(dict, fullPath);



        return task;
    }

    private List<HistoryEvent> GetDiff(PTask oldTask, PTask newTask)
    {
        List<HistoryEvent> diff = new List<HistoryEvent>();

        if (oldTask.Type != newTask.Type)
        {
            diff.Add(new HistoryEvent()
            {
                Field = "Type",
                OldValue = oldTask.Type.ToString(),
                NewValue = newTask.Type.ToString(),
                TaskId = newTask.Id,
                ProjectId = newTask.ProjectId,
                CreatedAt = DateTimeHelper.GetCurrentTimestamp()
            });
        }
        if (oldTask.Title != newTask.Title)
        {
            diff.Add(new HistoryEvent()
            {
                Field = "Title",
                OldValue = oldTask.Title,
                NewValue = newTask.Title,
                TaskId = newTask.Id,
                ProjectId = newTask.ProjectId,
                CreatedAt = DateTimeHelper.GetCurrentTimestamp()
            });
        }
        if (oldTask.Description != newTask.Description)
        {
            diff.Add(new HistoryEvent()
            {
                Field = "Description",
                OldValue = oldTask.Description,
                NewValue = newTask.Description,
                TaskId = newTask.Id,
                ProjectId = newTask.ProjectId,
                CreatedAt = DateTimeHelper.GetCurrentTimestamp()
            });
        }

        if (oldTask.Assignee != newTask.Assignee)
        {
            diff.Add(new HistoryEvent()
            {
                Field = "Assignee",
                OldValue = oldTask.Assignee,
                NewValue = newTask.Assignee,
                TaskId = newTask.Id,
                ProjectId = newTask.ProjectId,
                CreatedAt = DateTimeHelper.GetCurrentTimestamp()
            });
        }

        if (oldTask.Priority != newTask.Priority)
        {
            diff.Add(new HistoryEvent()
            {
                Field = "Priority",
                OldValue = oldTask.Priority.ToString(),
                NewValue = newTask.Priority.ToString(),
                TaskId = newTask.Id,
                ProjectId = newTask.ProjectId,
                CreatedAt = DateTimeHelper.GetCurrentTimestamp()
            });
        }

        if (oldTask.Status != newTask.Status)
        {
            diff.Add(new HistoryEvent()
            {
                Field = "Status",
                OldValue = oldTask.Status.ToString(),
                NewValue = newTask.Status.ToString(),
                TaskId = newTask.Id,
                ProjectId = newTask.ProjectId,
                CreatedAt = DateTimeHelper.GetCurrentTimestamp()
            });
        }

        if (oldTask.Estimate != newTask.Estimate)
        {
            diff.Add(new HistoryEvent()
            {
                Field = "Estimate",
                OldValue = oldTask.Estimate.ToString(),
                NewValue = newTask.Estimate.ToString(),
                TaskId = newTask.Id,
                ProjectId = newTask.ProjectId,
                CreatedAt = DateTimeHelper.GetCurrentTimestamp()
            });
        }

        return diff;
    }
}
