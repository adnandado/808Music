using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Hubs;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.ChatEndpoints
{
    public class ChatMarkAsReadEndpoint(ApplicationDbContext db, TokenProvider tp, IHubContext<ChatHub> ch) : MyEndpointBaseAsync.WithRequest<MarkAsReadRequest>.WithActionResult
    {
        [Authorize]
        [HttpPost]
        public override async Task<ActionResult> HandleAsync([FromBody] MarkAsReadRequest request, CancellationToken cancellationToken = default)
        {
            int userId = int.Parse(tp.GetJwtSub(Request));
            foreach (var message in request.Msgs) 
            {
                UserChat? canMarkAsRead = await db.UserChats.Where(uc => uc.Id == message.UserChatId && (uc.PrimaryChatterId == userId || uc.SecondaryChatterId == userId))
                    .FirstOrDefaultAsync(cancellationToken);

                if (canMarkAsRead == null)
                {
                    return BadRequest("Chat not found");
                }

                ChatMessage? msg = await db.ChatMessages.Where(m => message.Id == m.Id && !m.Seen && m.SenderId != userId).FirstOrDefaultAsync(cancellationToken);

                if (msg == null)
                {
                    continue;
                }

                msg.Seen = true;
                msg.SeetAt = DateTime.Now;
                await ch.Clients.User(msg.SenderId.ToString()).SendAsync("msgSeen", new MsgSeen
                {
                    Id = msg.Id,
                    Seen = msg.Seen,
                    SeenAt = msg.SeetAt,
                    UserChatId = msg.UserChatId,
                });
            }

            await db.SaveChangesAsync(cancellationToken);
            return Ok();
        }

    }
        public class MarkAsReadRequest
        {
            public List<MessageGetResponse> Msgs { get; set; }
        }

    public class MsgSeen
    {
        public int Id { get; set; }
        public DateTime SeenAt { get; set; }
        public bool Seen {  get; set; }
        public int UserChatId { get; set; }
    }
}
