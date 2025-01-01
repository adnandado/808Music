using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using RS1_2024_25.API.Services;
using System.IdentityModel.Tokens.Jwt;

namespace RS1_2024_25.API.Hubs
{
    [Authorize]
    public class NotificationsHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            //await Groups.AddToGroupAsync(Context.ConnectionId, Context.UserIdentifier!, default);
            //await Clients.Group(Context.UserIdentifier!).SendAsync("connectionStarted", $"Connection to notifications hub started " +
            //    $"{Context.UserIdentifier}", default);
            await Clients.User(Context.UserIdentifier!).SendAsync("connectionStarted", $"Connection to notifications hub started with user" +
                $"{Context.UserIdentifier}", default);
            await base.OnConnectedAsync();
        }
    }
}
