using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.NotificationEndpoints
{
    public class NotificationSetPreferencesEndpoint(ApplicationDbContext db, TokenProvider tp) : MyEndpointBaseAsync.WithRequest<MyAppUserPreference>.WithActionResult<MyAppUserPreference>
    {
        [Authorize]
        [HttpPost]
        public override async Task<ActionResult<MyAppUserPreference>> HandleAsync(MyAppUserPreference request, CancellationToken cancellationToken = default)
        {
            int userId = int.Parse(tp.GetJwtSub(Request));

            var preferences = await db.MyAppUserPreferences.FindAsync(userId, cancellationToken);

            if (preferences == null)
            {
                preferences = new MyAppUserPreference();
                preferences.MyAppUserId = userId;
                await db.MyAppUserPreferences.AddAsync(preferences, cancellationToken);
            }

            preferences.AllowPushNotifications = request.AllowPushNotifications;
            preferences.AllowEmailNotifications = request.AllowEmailNotifications;

            await db.SaveChangesAsync(cancellationToken);
            return Ok(preferences);
        }
    }
}
