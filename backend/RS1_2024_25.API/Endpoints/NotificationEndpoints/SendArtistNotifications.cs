using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Data.Models.Mail;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Hubs;
using RS1_2024_25.API.Services;
using RS1_2024_25.API.Services.Interfaces;
using System.Text;

namespace RS1_2024_25.API.Endpoints.NotificationEndpoints
{
    public class SendArtistNotifications(ApplicationDbContext db, IHubContext<NotificationsHub> nh, 
        NotificationTransformerService nt, IConfiguration cfg, IMyMailService ms) : MyEndpointBaseAsync.WithoutRequest.WithoutResult
    {
        [HttpGet]
        public override async Task HandleAsync(CancellationToken cancellationToken = default)
        {
            Request.Headers.TryGetValue("BackgroundScheduler", out StringValues headerValue);
            bool isFromOrigin = headerValue.ToString() == cfg["BackendUrl"];
            if (!isFromOrigin)
            {
                return;
            }

            var notificationsToSend = await db.Notifications.Where(n => !n.Sent).ToListAsync(cancellationToken);
            if (notificationsToSend != null)
            {
                await db.MyAppUsers.LoadAsync(cancellationToken);
                foreach (Notification notification in notificationsToSend)
                {
                    var usersToSendTo = await db.Follows.Where(f => f.WantsNotifications && f.ArtistId == notification.ArtistId).Select(f => f.MyAppUser).ToListAsync(cancellationToken);
                    if (usersToSendTo != null)
                    {
                        RichNotification richNotification = await nt.GetRichNotificationAsync(notification,cancellationToken);
                        foreach (var user in usersToSendTo)
                        {
                            //Send to connected clients
                            await nh.Clients.User(user.ID.ToString()).SendAsync("notificationReceived", richNotification, cancellationToken);

                            var preferences = await db.MyAppUserPreferences.FindAsync(user.ID, cancellationToken);
                            if(preferences != null)
                            {

                                if(preferences.AllowEmailNotifications)
                                {
                                    var mailBody = new StringBuilder();
                                    mailBody.Append($"Hi {user.Username},\n\n");
                                    mailBody.Append($"{richNotification.Artist.Name} has released a new {richNotification.Type}!\n\n");
                                    mailBody.Append($"If you want to stop getting email notifications log into your account and change your preferences in the notification center.\n");
                                    mailBody.Append($"808 Music");

                                    MailData mailData = new MailData
                                    {
                                        IsBodyHtml = false,
                                        Subject = $"New release from {richNotification.Artist!.Name}",
                                        To = user.Email,
                                        Body = mailBody
                                    };

                                    await ms.Send(mailData);
                                }
                                if(preferences.AllowPushNotifications)
                                {

                                }
                            }

                        }
                    }
                    notification.Sent = true;
                }
            }
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
