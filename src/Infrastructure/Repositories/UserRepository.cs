using Application.Users.GetByEmail;
using Domain.Users;
using Infrastructure.Database;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace Infrastructure.Repositories;

internal sealed class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
    }

    public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await DbContext.Users
            .SingleOrDefaultAsync(u => u.Email == email, cancellationToken);
    }

    public async Task<UserResponse?> GetUserResponseByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await DbContext.Users
            .Where(u => u.Id == id)
            .Select(u => new UserResponse
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email
            })
            .SingleOrDefaultAsync(cancellationToken);
    }

    public async Task<UserResponse?> GetUserResponseByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await DbContext.Users
            .Where(u => u.Email == email)
            .Select(u => new UserResponse
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email
            })
            .SingleOrDefaultAsync(cancellationToken);
    }

    public bool Exists(string email)
    {
        return DbContext.Users.Any(u => u.Email == email);
    }

    public async Task<bool> ExistsAsync(string email, CancellationToken cancellationToken = default)
    {
        return await DbContext.Users.AnyAsync(u => u.Email == email, cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await DbContext.SaveChangesAsync(cancellationToken);
    }
}