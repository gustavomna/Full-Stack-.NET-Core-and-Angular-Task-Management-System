using Application.Abstractions.Authentication;
using Application.Abstractions.Messaging;
using Application.Tasks.GetById;
using Domain.TaskItems;
using SharedKernel;

namespace Application.Tasks.GetAllForUser;

internal sealed class GetAllTasksForUserQueryHandler(
    ITaskRepository taskRepository,
    IUserContext userContext) : IQueryHandler<GetAllTasksForUserQuery, List<TaskResponse>>
{
    public async Task<Result<List<TaskResponse>>> Handle(GetAllTasksForUserQuery query, CancellationToken cancellationToken)
    {
        var tasks = await taskRepository.GetByUserIdAsync(userContext.UserId, cancellationToken);

        var response = tasks.Select(task => new TaskResponse
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            DueDate = task.DueDate,
            Priority = task.Priority,
            Status = task.Status,
            UserId = task.UserId
        }).ToList();

        return response;
    }
}