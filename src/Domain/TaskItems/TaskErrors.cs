using SharedKernel;

namespace Domain.TaskItems;

public static class TaskErrors
{
    public static Error AlreadyCompleted(Guid TaskId) => Error.Problem(
        "Task.AlreadyCompleted",
        $"The task with Id = '{TaskId}' is already completed.");

    public static Error NotFound(Guid TaskId) => Error.NotFound(
        "Task.NotFound",
        $"The task with the Id = '{TaskId}' was not found");

    public static Error Unauthorized() =>
        Error.Failure("Task.Unauthorized", "Você não está autorizado a acessar esta tarefa.");
}
