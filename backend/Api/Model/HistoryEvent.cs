using System.ComponentModel.DataAnnotations;

namespace Api.Model;

public class HistoryEvent
{
    public string Id { get; set; }
    public string ProjectId { get; set; }
    [Required]
    public string TaskId { get; set; }
    public long CreatedAt { get; set; }
    public string Field { get; set; }
    public string OldValue { get; set; }
    public string NewValue { get; set; }
}
