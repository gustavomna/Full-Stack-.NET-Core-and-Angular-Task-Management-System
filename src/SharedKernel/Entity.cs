namespace SharedKernel;

public abstract class Entity<TEntityId> : IEntity
{
    private readonly List<IDomainEvent> _domainEvents = new();

    protected Entity(TEntityId id)
    {
        Id = id;
    }

    protected Entity() { }

    public TEntityId Id { get; init; }

    public void ClearDomainEvents() => _domainEvents.Clear();
    public IReadOnlyList<IDomainEvent> GetDomainEvents() => _domainEvents.ToList();
    protected void RaiseDomainEvent(IDomainEvent domainEvent) => _domainEvents.Add(domainEvent);

}
