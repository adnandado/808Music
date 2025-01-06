using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace RS1_2024_25.API.Endpoints.NotificationEndpoints
{
    public class NotificationGetPreferenceEndpoint(ApplicationDbContext db, TokenProvider tp) : MyEndpointBaseAsync.WithoutRequest.WithActionResult<MyAppUserPreference>
    {
        [Authorize]
        [HttpGet]
        public override async Task<ActionResult<MyAppUserPreference>> HandleAsync(CancellationToken cancellationToken = default)
        {
            int userId = int.Parse(tp.GetJwtSub(Request));

            var preferences = await db.MyAppUserPreferences.FindAsync(userId, cancellationToken);

            if (preferences == null)
            {
                preferences = new MyAppUserPreference();
                preferences.MyAppUserId = userId;
                await db.MyAppUserPreferences.AddAsync(preferences, cancellationToken);
                await db.SaveChangesAsync(cancellationToken);
            }

            return Ok(preferences);
        }
    }
}
