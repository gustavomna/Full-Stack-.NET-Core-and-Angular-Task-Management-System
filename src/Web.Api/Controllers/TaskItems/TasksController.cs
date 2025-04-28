using Application.TaskItems.Create;
using Application.Tasks.Create;
using Application.Tasks.Delete;
using Application.Tasks.GetAllForUser;
using Application.Tasks.GetById;
using Application.Tasks.Update;
using Domain.TaskItems;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SharedKernel;
using Web.Api.Controllers.TaskItems;

namespace Web.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly ISender _sender;

    public TasksController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var query = new GetAllTasksForUserQuery();
        Result<List<TaskResponse>> result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess ? Ok(result.Value) : this.Problem(result.Error);

    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var query = new GetTaskByIdQuery(id);
        Result<TaskResponse> result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess ? Ok(result.Value) : this.Problem(result.Error);

    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTaskRequest request, CancellationToken cancellationToken)
    {
        var command = new CreateTaskCommand(
            request.Title,
            request.Description,
            request.DueDate,
            request.Priority);

        Result<Guid> result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess ? Ok(result.Value) : this.Problem(result.Error);

    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTaskRequest request, CancellationToken cancellationToken)
    {
        var command = new UpdateTaskCommand(
            id,
            request.Title,
            request.Description,
            request.DueDate,
            request.Priority,
            request.Status);

        Result result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? NoContent()
            : this.Problem(result.Error);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var command = new DeleteTaskCommand(id);
        Result result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? NoContent()
            : this.Problem(result.Error);
    }
}