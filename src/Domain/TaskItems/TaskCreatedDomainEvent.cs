using SharedKernel;

namespace Domain.TaskItems;

public sealed record TaskCreatedDomainEvent(Guid TaskId) : IDomainEvent;
