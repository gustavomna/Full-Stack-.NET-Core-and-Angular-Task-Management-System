using Application.Abstractions.Messaging;
using Domain.TaskItems;
using SharedKernel;
namespace Application.Tasks.Update;

public sealed record UpdateTaskCommand(
    Guid TaskId,
    string Title,
    string Description,
    DateTime? DueDate,
    Priority Priority,
    Status Status) : ICommand;