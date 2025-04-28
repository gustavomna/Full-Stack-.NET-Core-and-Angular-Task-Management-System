using Application.Abstractions.Messaging;
using Domain.TaskItems;
using SharedKernel;
namespace Application.Tasks.GetAllForUser;

public sealed record GetAllTasksForUserQuery() : IQuery<List<TaskResponse>>;