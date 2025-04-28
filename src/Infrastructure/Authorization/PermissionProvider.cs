using Domain.Users;
using Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

internal sealed class PermissionProvider(ApplicationDbContext dbContext)
{
    private readonly ApplicationDbContext _dbContext = dbContext;

    public async Task<HashSet<string>> GetForUserIdAsync(Guid userId)
    {
        var permissions = await _dbContext.Set<UserPermission>()
            .Where(p => p.UserId == userId)
            .Select(p => p.PermissionName)
            .ToListAsync();

        return new HashSet<string>(permissions);
    }
}