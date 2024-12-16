using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Helper.Api;

namespace RS1_2024_25.API.Endpoints.TrackEndpoints
{
    public class TrackStreamEndpoint : MyEndpointBaseAsync.WithRequest<int>.WithActionResult
    {
        [Authorize]
        [HttpGet]
        public override Task<ActionResult> HandleAsync(int request, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }
    }
}
