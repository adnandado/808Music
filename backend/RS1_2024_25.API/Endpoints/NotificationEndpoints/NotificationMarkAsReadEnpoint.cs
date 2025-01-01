using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.NotificationEndpoints
{
    public class NotificationMarkAsReadEnpoint(ApplicationDbContext db, TokenProvider tp) : MyEndpointBaseAsync.WithRequest<int>.WithActionResult
    {
        [Authorize]
        [HttpPost]
        public override async Task<ActionResult> HandleAsync(int notificationId, CancellationToken cancellationToken = default)
        {
            int userId = int.Parse(tp.GetJwtSub(Request));

            Notification? notification = await db.Notifications.FindAsync(notificationId, cancellationToken);
            if (notification == null)
            {
                return BadRequest("Notification doesn't exist");
            }

            ReadNotification? alreadyRead = await db.ReadNotifications.Where(rn => rn.MyAppUserId == userId && rn.NotificationId == notificationId).FirstOrDefaultAsync(cancellationToken);
            if (alreadyRead != null)
            {
                return BadRequest("Already seen this notification");
            }

            ReadNotification readNotification = new ReadNotification
            {
                MyAppUserId = userId,
                NotificationId = notificationId,
                ReadAt = DateTime.Now,
            };

            await db.ReadNotifications.AddAsync(readNotification,cancellationToken);
            await db.SaveChangesAsync(cancellationToken);

            return Ok();
        }
    }
}
