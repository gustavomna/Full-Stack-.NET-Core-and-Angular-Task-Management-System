namespace Domain.Users;

public class UserPermission
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string PermissionName { get; set; }
    public User User { get; set; }
}