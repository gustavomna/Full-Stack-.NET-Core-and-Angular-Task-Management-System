using Domain.TaskItems;

namespace Web.Api.Controllers.TaskItems;
public class CreateTaskRequest
{
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime? DueDate { get; set; }
    public Priority Priority { get; set; }
}
