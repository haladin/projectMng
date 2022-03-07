using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Api.Model;

public class Project
{
    public string Id { get; set; }
    [Required]
    public string Name { get; set; }

    public string Avatar { get; set; }
    public List<string> Tasks { get; set; }
}
