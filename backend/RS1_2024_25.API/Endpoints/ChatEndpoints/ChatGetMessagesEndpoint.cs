using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace RS1_2024_25.API.Endpoints.ChatEndpoints
{
    public class ChatGetMessagesEndpoint(ApplicationDbContext db, TokenProvider tp) : MyEndpointBaseAsync.WithRequest<int>.WithActionResult<List<MessageGetResponse>>
    {
        [Authorize]
        [HttpGet("{id}")]
        public override async Task<ActionResult<List<MessageGetResponse>>> HandleAsync(int id, CancellationToken cancellationToken = default)
        {
            int userId = int.Parse(tp.GetJwtSub(Request));
            await db.UserChats.LoadAsync();

            var messages = await db.ChatMessages.Where(cm => cm.UserChatId == id && (cm.UserChat.PrimaryChatterId == userId || cm.UserChat.SecondaryChatterId == userId))
                .OrderBy(cm => cm.SentAt).Select(cm => new MessageGetResponse
                {
                    Id = cm.Id,
                    ContentType = cm.ContentType,
                    ContentId = cm.ContentId,
                    Message = cm.Message,
                    Seen = cm.Seen,
                    SeenAt = cm.SeetAt,
                    SenderId = cm.SenderId,
                    Sender = cm.Sender.Username,
                    SentAt = cm.SentAt,
                    UserChatId = id,
                }).ToListAsync();

            return Ok(messages);
        }
    }

    public class MessageGetResponse
    {
        public int Id { get; set; }
        public int UserChatId { get; set; }
        public string Message { get; set; } = string.Empty;
        public int ContentId { get; set; }
        public string ContentType { get; set; } = "Track";
        public object? Content { get; set; }
        public int SenderId { get; set; }
        public string Sender {  get; set; } = String.Empty;
        public DateTime SentAt { get; set; }
        public bool Seen { get; set; }
        public DateTime SeenAt { get; set; }
    }
}
