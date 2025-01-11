using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Endpoints.ChatEndpoints
{
    public class ChatGetEndpoint(ApplicationDbContext db, TokenProvider tp) : MyEndpointBaseAsync.WithoutRequest.WithActionResult<List<ChatGetResponse>>
    {
        [Authorize]
        [HttpGet]
        public override async Task<ActionResult<List<ChatGetResponse>>> HandleAsync(CancellationToken cancellationToken = default)
        {
            int userId = int.Parse(tp.GetJwtSub(Request));

            var chats = await db.UserChats.Where(c => c.PrimaryChatterId == userId || c.SecondaryChatterId == userId).OrderByDescending(c => c.LastMessageAt).ToListAsync();

            await db.MyAppUsers.LoadAsync();
            var response = chats.Select(c => new ChatGetResponse
            {
                Blocked = c.Blocked,
                Muted = c.Muted,
                Id = c.Id,
                Chatter = c.PrimaryChatterId == userId ? c.SecondaryChatter.Username : c.PrimaryChatter.Username,
                OtherChatter = c.PrimaryChatterId != userId ? c.SecondaryChatter.Username : c.PrimaryChatter.Username,
                CreatedAt = c.CreatedAt,
                LastMessageAt = c.LastMessageAt,
                LastMessage = db.ChatMessages.Where(cm => cm.UserChatId == c.Id).OrderByDescending(cm => cm.SentAt).Select(cm => cm.Message).FirstOrDefault() ?? "",
                NumberOfUnreads = db.ChatMessages.Where(cm => cm.UserChatId == c.Id && !cm.Seen).Count(),
                LastMessageSenderId = db.ChatMessages.Where(cm => cm.UserChatId == c.Id).OrderByDescending(cm => cm.SentAt).Select(cm => cm.SenderId).FirstOrDefault(),
            }).ToList();

            return Ok(response);
        }
    }

    public class ChatGetResponse
    {
        public int Id { get; set; }
        public string Chatter { get; set; } = string.Empty;
        public string OtherChatter { get; set; } = string.Empty;
        public string LastMessage {  get; set; } = string.Empty;
        public int LastMessageSenderId { get; set; }
        public bool Muted { get; set; }
        public bool Blocked { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastMessageAt { get; set; }
        public int NumberOfUnreads { get; set; }
    }
}
