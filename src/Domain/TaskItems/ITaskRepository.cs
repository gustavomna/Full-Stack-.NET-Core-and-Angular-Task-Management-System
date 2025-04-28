
namespace Domain.TaskItems;

public interface ITaskRepository
{
    Task<TaskItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<List<TaskItem>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<List<TaskItem>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    void Add(TaskItem task);
    void Update(TaskItem task);
    void Delete(TaskItem task);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}