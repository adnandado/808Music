using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.ChatEndpoints
{
    public class ChatMessageMarkAsReadEndpoint(ApplicationDbContext db, TokenProvider tp) : MyEndpointBaseAsync.WithRequest<MsgMarkAsReadRequest>.WithActionResult<int>
    {
        [Authorize]
        [HttpPost]
        public override async Task<ActionResult<int>> HandleAsync(MsgMarkAsReadRequest request, CancellationToken cancellationToken = default)
        {
            int userId = int.Parse(tp.GetJwtSub(Request));
            ChatMessage? canMarkAsRead = await db.ChatMessages.Where(cm => cm.Id == request.MessageId && !cm.Seen &&
            (cm.UserChat.PrimaryChatterId == userId || cm.UserChat.SecondaryChatterId == userId) && cm.SenderId != userId && !cm.UserChat.Blocked).FirstOrDefaultAsync(cancellationToken);

            if (canMarkAsRead == null)
            {
                return BadRequest("Chat not found");
            }

            canMarkAsRead.Seen = true;
            canMarkAsRead.SeetAt = DateTime.Now;
            await db.SaveChangesAsync(cancellationToken);
            return Ok(canMarkAsRead.Id);
        }
    }

    public class MsgMarkAsReadRequest
    {
        public int MessageId { get; set; }
    }
}
