using Microsoft.AspNetCore.Mvc;
using SharedKernel;

public static class ControllerExtensions
{
    public static IActionResult Problem(this ControllerBase controller, Error error)
    {
        if (error == Error.None)
        {
            return controller.Ok();
        }

        var statusCode = error.Type switch
        {
            ErrorType.Failure => StatusCodes.Status400BadRequest,
            ErrorType.NotFound => StatusCodes.Status404NotFound,
            ErrorType.Conflict => StatusCodes.Status409Conflict,
            ErrorType.Problem => StatusCodes.Status500InternalServerError,
            _ => StatusCodes.Status500InternalServerError
        };

        var problemDetails = new ProblemDetails
        {
            Status = statusCode,
            Title = error.Code,
            Detail = error.Description
        };

        return controller.ObjectResult(problemDetails, statusCode);
    }

    private static ObjectResult ObjectResult(this ControllerBase controller, object value, int statusCode)
    {
        return new ObjectResult(value)
        {
            StatusCode = statusCode
        };
    }
}