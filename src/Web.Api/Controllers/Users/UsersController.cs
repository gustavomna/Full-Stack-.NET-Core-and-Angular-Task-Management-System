using Application.Users.GetById;
using Application.Users.Login;
using Application.Users.Register;
using Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SharedKernel;
using Web.Api.Controllers.Users;
using Web.Api.Infrastructure;

namespace Web.Api.Controllers.Users;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly ISender _sender;

    public UsersController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet("{userId:guid}")]
    [Authorize]
    public async Task<IActionResult> GetById(Guid userId, CancellationToken cancellationToken)
    {
        var query = new GetUserByIdQuery(userId);
        Result<UserResponse> result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess ? Ok(result.Value) : this.Problem(result.Error);

    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var command = new LoginUserCommand(request.Email, request.Password);
        Result<string> result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess ? Ok(result.Value) : this.Problem(result.Error);

    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
    {
        var command = new RegisterUserCommand(
            request.Email,
            request.FirstName,
            request.LastName,
            request.Password);

        Result<Guid> result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess ? Ok(result.Value) : this.Problem(result.Error);

    }
}
