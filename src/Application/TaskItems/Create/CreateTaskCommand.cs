using Application.Abstractions.Messaging;
using Domain.TaskItems;

namespace Application.TaskItems.Create;

public sealed record CreateTaskCommand(
    string Title,
    string Description,
    DateTime? DueDate,
    Priority Priority,
    Guid UserId) : ICommand<Guid>;
