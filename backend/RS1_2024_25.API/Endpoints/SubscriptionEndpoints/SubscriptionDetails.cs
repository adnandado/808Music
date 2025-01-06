using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/subscription-details")]
public class SubscriptionDetailsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public SubscriptionDetailsController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<SubscriptionDetails>>> GetAllSubscriptionDetails()
    {
        var subscriptions = _db.SubscriptionDetails.ToList();
        return Ok(subscriptions);
    }
}
