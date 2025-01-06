using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Helper.Api;

namespace RS1_2024_25.API.Endpoints.NotificationEndpoints
{
    public class NotificationGetTypesEndpoint : MyEndpointBaseAsync.WithoutRequest.WithActionResult<List<string>>
    {
        [HttpGet]
        public override async Task<ActionResult<List<string>>> HandleAsync(CancellationToken cancellationToken = default)
        {
            List<string> list = new List<string> { "Album", "Product", "Message" };
            return Ok(list);
        }
    }
}
