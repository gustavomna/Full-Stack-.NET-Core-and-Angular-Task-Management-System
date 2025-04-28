using Application.Abstractions.Messaging;
using Domain.TaskItems;

namespace Application.Tasks.GetById;

public sealed record GetTaskByIdQuery(Guid TaskId) : IQuery<TaskResponse>;
