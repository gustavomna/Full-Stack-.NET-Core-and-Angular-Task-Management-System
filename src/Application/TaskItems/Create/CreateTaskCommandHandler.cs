using Application.Abstractions.Authentication;
using Application.Abstractions.Messaging;
using Application.TaskItems.Create;
using Domain.TaskItems;
using SharedKernel;

namespace Application.Tasks.Create;

internal sealed class CreateTaskCommandHandler(
    ITaskRepository taskRepository,
    IUserContext userContext) : ICommandHandler<CreateTaskCommand, Guid>
{
    public async Task<Result<Guid>> Handle(CreateTaskCommand command, CancellationToken cancellationToken)
    {
        var task = new TaskItem
        {
            Id = Guid.NewGuid(),
            Title = command.Title,
            Description = command.Description,
            DueDate = command.DueDate,
            Priority = command.Priority,
            Status = Status.Open,
            UserId = userContext.UserId
        };

        if (task.UserId != userContext.UserId)
        {
            return (Result<Guid>)Result.Failure(TaskErrors.Unauthorized());
        }

        task.Raise(new TaskCreatedDomainEvent(task.Id));

        taskRepository.Add(task);
        await taskRepository.SaveChangesAsync(cancellationToken);

        return task.Id;
    }
}