using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Hubs;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.ChatEndpoints
{
    public class ChatToggleBlockEndpoint(ApplicationDbContext db, TokenProvider tp, IHubContext<ChatHub> ch) : MyEndpointBaseAsync.WithRequest<int>.WithActionResult<ChatBlockResponse>
    {
        [HttpGet("{id}")]
        public override async Task<ActionResult<ChatBlockResponse>> HandleAsync(int id, CancellationToken cancellationToken = default)
        {
            int userId = int.Parse(tp.GetJwtSub(Request));

            var userChat = await db.UserChats.Where(uc => uc.Id == id && (uc.PrimaryChatterId == userId || uc.SecondaryChatterId == userId))
                .FirstOrDefaultAsync(cancellationToken);
            if (userChat == null)
            {
                return NotFound();
            }

            if (userChat.Blocked && userChat.BlockedByUserId == userId)
            {
                userChat.BlockedByUserId = null;
                userChat.Blocked = false;
            }
            else if(userChat.Blocked && userChat.BlockedByUserId != userId) {
                return Unauthorized();
            }
            else
            {
                userChat.BlockedByUserId = userId;
                userChat.Blocked = true;
            }
            await db.SaveChangesAsync();


            await db.MyAppUsers.LoadAsync(cancellationToken);
            var response = new ChatBlockResponse
            {
                Id = userChat.Id,
                IsBlocked = userChat.Blocked,
                BlockedByUserId = userId,
                BlockedByUser = userChat.PrimaryChatterId != userId ? userChat.SecondaryChatter.Username : userChat.PrimaryChatter.Username
            };

            await ch.Clients.User(userId.ToString()).SendAsync("chatBlocked", response);

            int otherChatter = userChat.PrimaryChatterId == userId ? userChat.SecondaryChatterId : userChat.PrimaryChatterId;
            await ch.Clients.User(otherChatter.ToString()).SendAsync("chatBlocked", response);

            return Ok(response);
        }

    }
    public class ChatBlockResponse
    {
        public int Id { get; set; }
        public bool IsBlocked { get; set; }
        public int BlockedByUserId { get; set; }
        public string BlockedByUser { get; set; } = string.Empty;
    }
}
