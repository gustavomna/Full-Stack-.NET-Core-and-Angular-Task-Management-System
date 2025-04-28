using SharedKernel;

namespace Domain.TaskItems;

public sealed record TaskDeletedDomainEvent(Guid TaskId) : IDomainEvent;
