using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.ChatEndpoints
{
    public class ChatCreateEndpoint(ApplicationDbContext db, TokenProvider tp) : MyEndpointBaseAsync.WithRequest<ChatCreateRequest>.WithActionResult<ChatGetResponse>
    {
        [Authorize]
        [HttpPost]
        public override async Task<ActionResult<ChatGetResponse>> HandleAsync([FromBody] ChatCreateRequest request, CancellationToken cancellationToken = default)
        {
            int userId = int.Parse(tp.GetJwtSub(Request));

            UserChat? userChatExists = await db.UserChats.Where(c => (c.PrimaryChatterId == userId && c.SecondaryChatterId == request.SecondaryUserId)
                                                || (c.PrimaryChatterId == request.SecondaryUserId && c.SecondaryChatterId == userId)).FirstOrDefaultAsync(cancellationToken);

            if(userChatExists != null)
            {
                return BadRequest($"Chat between these users already exists!");
            }

            userChatExists = new UserChat
            {
                PrimaryChatterId = userId,
                SecondaryChatterId = request.SecondaryUserId,
                CreatedAt = DateTime.Now,
                LastMessageAt = DateTime.Now,
            };

            await db.UserChats.AddAsync(userChatExists, cancellationToken);
            await db.SaveChangesAsync(cancellationToken);

            await db.MyAppUsers.LoadAsync(cancellationToken);
            return Ok(new ChatGetResponse
            {
                Blocked = userChatExists.Blocked,
                Muted = userChatExists.Muted,
                Id = userChatExists.Id,
                Chatter = userChatExists.PrimaryChatterId == userId ? userChatExists.SecondaryChatter.Username : userChatExists.PrimaryChatter.Username,
                OtherChatter = userChatExists.PrimaryChatterId != userId ? userChatExists.SecondaryChatter.Username : userChatExists.PrimaryChatter.Username,
                CreatedAt = userChatExists.CreatedAt,
                LastMessageAt = userChatExists.LastMessageAt,
                LastMessage = db.ChatMessages.Where(cm => cm.UserChatId == userChatExists.Id).OrderByDescending(cm => cm.SentAt).Select(cm => cm.Message).FirstOrDefault() ?? ""
            });
        }
    }

    public class ChatCreateRequest
    {
        public int SecondaryUserId { get; set; }
    }

}
