using Domain.TaskItems;
using Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal sealed class TaskRepository : Repository<TaskItem>, ITaskRepository
{
    public TaskRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
    }

    public async Task<List<TaskItem>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await DbContext.Set<TaskItem>()
            .ToListAsync(cancellationToken);
    }

    public async Task<List<TaskItem>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await DbContext.Set<TaskItem>()
            .Where(t => t.UserId == userId)
            .ToListAsync(cancellationToken);
    }

    public void Update(TaskItem task)
    {
        DbContext.Set<TaskItem>().Update(task);
    }

    public void Delete(TaskItem task)
    {
        DbContext.Set<TaskItem>().Remove(task);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await DbContext.SaveChangesAsync(cancellationToken);
    }
}