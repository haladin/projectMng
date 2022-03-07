using Api.Model;
using System.Text.Json;

namespace Api.DataServices;

public class HistoryEventService : IService<HistoryEvent>
{
    private readonly IService<Project> _projectService;
    public const string PATH = "History";
    public static readonly string fullPath = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, PATH));

    public HistoryEventService(IService<Project> projectService)
    {
        _projectService = projectService;        
    }

    public async Task Delete(string id)
    {
        throw new NotImplementedException();
    }

    public async Task<HistoryEvent> Get(string id)
    {
        HistoryEvent hEvent = null;
        try
        {
            var rawData = await FileHelper.ReadAFiles(fullPath, id);

            hEvent = JsonSerializer.Deserialize<HistoryEvent>(rawData);

        }
        catch (Exception e)
        {
            Console.WriteLine("The process failed: {0}", e.ToString());
        }
        return hEvent;
    }

    public async Task<List<HistoryEvent>> GetAll()
    {
        var events = new List<HistoryEvent>();
        try
        {
            var rawData = await FileHelper.ReadAllFiles(fullPath);

            foreach (var file in rawData)
            {
                var hEvent = JsonSerializer.Deserialize<HistoryEvent>(file);
                events.Add(hEvent);
            }
        }
        catch (Exception e)
        {
            Console.WriteLine("The process failed: {0}", e.ToString());
        }

        return events;
    }

    public async Task<List<HistoryEvent>> GetAllForAParent(string id)
    {
        var events = new List<HistoryEvent>();
        try
        {
            var rawData = await FileHelper.ReadAllFiles(fullPath);

            foreach (var file in rawData)
            {
                var hEvent = JsonSerializer.Deserialize<HistoryEvent>(file);
                events.Add(hEvent);
            }
        }
        catch (Exception e)
        {
            Console.WriteLine("The process failed: {0}", e.ToString());
        }

        return events.FindAll(e => e.TaskId == id);
    }

    public async Task<HistoryEvent> Update(HistoryEvent hEvent)
    {
        if (hEvent.Id == null)
        {
            // New project
            var id = FileHelper.CreateId(fullPath);
            hEvent.Id = id;
        } else
        {
            throw new Exception($"Events can't be modified");
        }

        var json = JsonSerializer.Serialize(hEvent);
        var dict = new Dictionary<string, string>() {
                {hEvent.Id, json}
            };
        await FileHelper.ProcessMulitpleWritesAsync(dict, fullPath);

        return hEvent;
    }

}
