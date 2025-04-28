using SharedKernel;

namespace Domain.TaskItems;

public sealed record TaskCompletedDomainEvent(Guid TaskId) : IDomainEvent;
