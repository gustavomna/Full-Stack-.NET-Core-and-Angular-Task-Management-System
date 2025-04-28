using Application.Abstractions.Authentication;
using Application.Abstractions.Messaging;
using Application.Tasks.GetById;
using Domain.TaskItems;
using SharedKernel;


namespace Application.TaskItems.GetById;

internal sealed class GetTaskByIdQueryHandler(
    ITaskRepository taskRepository,
    IUserContext userContext) : IQueryHandler<GetTaskByIdQuery, TaskResponse>
{
    public async Task<Result<TaskResponse>> Handle(GetTaskByIdQuery query, CancellationToken cancellationToken)
    {
        var task = await taskRepository.GetByIdAsync(query.TaskId, cancellationToken);

        if (task is null)
        {
            return Result.Failure<TaskResponse>(TaskErrors.NotFound(query.TaskId));
        }

        if (task.UserId != userContext.UserId)
        {
            return Result.Failure<TaskResponse>(TaskErrors.Unauthorized());
        }

        var response = new TaskResponse
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            DueDate = task.DueDate,
            Priority = task.Priority,
            Status = task.Status,
            UserId = task.UserId
        };

        return response;
    }
}