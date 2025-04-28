namespace Domain.TaskItems;

public sealed class TaskResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime? DueDate { get; set; }
    public Priority Priority { get; set; }
    public Status Status { get; set; }
    public Guid UserId { get; set; }
}