using Application.Abstractions.Authentication;
using Application.Abstractions.Messaging;
using Domain.TaskItems;
using SharedKernel;

namespace Application.Tasks.Delete;

internal sealed class DeleteTaskCommandHandler(
    ITaskRepository taskRepository,
    IUserContext userContext) : ICommandHandler<DeleteTaskCommand>
{
    public async Task<Result> Handle(DeleteTaskCommand command, CancellationToken cancellationToken)
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

        task.Raise(new TaskDeletedDomainEvent(task.Id));

        taskRepository.Delete(task);
        await taskRepository.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}