using SharedKernel;

namespace Domain.TaskItems;
public sealed record TaskUpdatedDomainEvent(Guid TaskId) : IDomainEvent;
