using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Data.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Endpoints.ChatEndpoints;

namespace RS1_2024_25.API.Hubs
{
    [Authorize]
    public class ChatHub(ApplicationDbContext db) : Hub
    {
        public override async Task OnConnectedAsync()
        {
            await Clients.User(Context.UserIdentifier!).SendAsync("chatStarted", "Connected to chat!");
            await base.OnConnectedAsync();
        }

        public async Task<int> SendMessage(MessageSendRequest message)
        {
            if(!int.TryParse(Context.UserIdentifier!, out int userId))
            {
                return 400;
            }

            var userChat = await db.UserChats.Where(uc => uc.Id == message.UserChatId
            && (uc.SecondaryChatterId == userId || uc.PrimaryChatterId == userId)).FirstOrDefaultAsync();

            if (userChat == null)
            {
                return 400;
            }

            if(userChat.Blocked)
            {
                return 401;
            }

            int receiverId = userChat.PrimaryChatterId == userId ? userChat.SecondaryChatterId : userChat.PrimaryChatterId;

            ChatMessage chatMessage = new ChatMessage
            {
                ContentId = message.ContentId,
                ContentType = message.ContentType,
                Message = message.Message,
                SenderId = userId,
                SentAt = DateTime.Now,
                UserChatId = message.UserChatId,
            };

            await db.ChatMessages.AddAsync(chatMessage);
            userChat.LastMessageAt = DateTime.Now;
            await db.SaveChangesAsync();

            var response = new MessageGetResponse
            {
                Id = chatMessage.Id,
                ContentId = chatMessage.ContentId,
                ContentType = chatMessage.ContentType,
                Message = chatMessage.Message,
                Seen = chatMessage.Seen,
                SeenAt = chatMessage.SeetAt,
                SenderId = chatMessage.SenderId,
                SentAt = chatMessage.SentAt,
                UserChatId = chatMessage.UserChatId,
                Sender = db.MyAppUsers.Find(chatMessage.SenderId)?.Username ?? ""
            };

            await Clients.User(Context.UserIdentifier!).SendAsync("receiveMessage", response);
            await Clients.User(receiverId.ToString()).SendAsync("receiveMessage", response);
            return 200;
        }
    }

    public class MessageSendRequest
    {
        public int UserChatId { get; set; }
        public string Message { get; set; } = string.Empty;
        public int ContentId { get; set; }
        public string ContentType { get; set; } = "Track";
    }
}
