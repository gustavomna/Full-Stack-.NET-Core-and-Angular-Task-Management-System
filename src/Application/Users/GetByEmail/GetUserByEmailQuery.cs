using Application.Abstractions.Messaging;
using Domain.Users;

namespace Application.Users.GetByEmail;

public sealed record GetUserByEmailQuery(string Email) : IQuery<UserResponse>;
