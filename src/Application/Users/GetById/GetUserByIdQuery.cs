using Application.Abstractions.Messaging;
using Domain.Users;

namespace Application.Users.GetById;

public sealed record GetUserByIdQuery(Guid UserId) : IQuery<UserResponse>;
