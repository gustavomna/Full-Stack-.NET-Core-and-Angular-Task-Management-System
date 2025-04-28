using Application.Abstractions.Authentication;
using Application.Abstractions.Messaging;
using Domain.TaskItems;
using SharedKernel;

namespace Application.Tasks.Update;

internal sealed class UpdateTaskCommandHandler(
    ITaskRepository taskRepository,
    IUserContext userContext) : ICommandHandler<UpdateTaskCommand>
{
    public async Task<Result> Handle(UpdateTaskCommand command, CancellationToken cancellationToken)
    {
        var task = await taskRepository.GetByIdAsync(command.TaskId, cancellationToken);

        if (task is null)
        {
            return Result.Failure(TaskErrors.NotFound(command.TaskId));
        }

        if (task.UserId != userContext.UserId)
        {
            return Result.Failure(TaskErrors.Unauthorized());
        }

        task.Title = command.Title;
        task.Description = command.Description;
        task.DueDate = command.DueDate;
        task.Priority = command.Priority;
        task.Status = command.Status;

        task.Raise(new TaskUpdatedDomainEvent(task.Id));

        taskRepository.Update(task);
        await taskRepository.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}