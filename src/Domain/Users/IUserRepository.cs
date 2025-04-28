namespace Domain.Users;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<UserResponse?> GetUserResponseByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<UserResponse?> GetUserResponseByEmailAsync(string email, CancellationToken cancellationToken = default);
    bool Exists(string email);
    Task<bool> ExistsAsync(string email, CancellationToken cancellationToken = default);
    void Add(User user);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}