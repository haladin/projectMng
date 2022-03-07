using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Api.Model;

public class PTask
{
    public string Id { get; set; }
    [Required]
    public string ProjectId { get; set; }
    public Type Type { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string Assignee { get; set; }
    public Priority Priority { get; set; }
    public Status Status { get; set; }
    public long Estimate { get; set; }
    public long CreatedAt { get; set; }        
    public List<string> History { get; set; }
}

public enum Type
{
    Story,
    Bug
}

public enum Priority
{
    Low,
    Normal,
    High,
    Critical
}

public enum Status
{
    ToDo,
    InProgress,
    ReadyForTest,
    Done
}
