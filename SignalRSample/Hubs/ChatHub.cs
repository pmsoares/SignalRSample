using Microsoft.AspNetCore.SignalR;
using SignalRSample.Data;
using System.Security.Claims;

namespace SignalRSample.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ApplicationDbContext _db;

        public ChatHub(ApplicationDbContext db) => _db = db;

        public override Task OnConnectedAsync()
        {
            var userId = Context.User!.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!String.IsNullOrEmpty(userId))
            {
                var userName = _db.Users.FirstOrDefault(_ => _.Id == userId)!.UserName;
                Clients.Users(HubConnections.OnlineUsers()).SendAsync("ReceiveUserConnected", userId, userName);
                HubConnections.AddUserConnection(userId, Context.ConnectionId);
            }
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            string? userId = Context.User!.FindFirstValue(ClaimTypes.NameIdentifier);

            if (HubConnections.HasUserConnection(userId!, Context.ConnectionId))
            {
                var UserConnections = HubConnections.Users[userId!];
                UserConnections.Remove(Context.ConnectionId);

                HubConnections.Users.Remove(userId!);
                if (UserConnections.Any())
                    HubConnections.Users.Add(userId!, UserConnections);
            }

            if (!String.IsNullOrEmpty(userId))
            {
                string? userName = _db.Users.FirstOrDefault(_ => _.Id == userId)!.UserName;
                Clients.Users(HubConnections.OnlineUsers()).SendAsync("ReceiveUserDisconnected", userId, userName);
                HubConnections.AddUserConnection(userId, Context.ConnectionId);
            }
            return base.OnDisconnectedAsync(exception);
        }

        public async Task SendAddRoomMessage(int maxRoom, int roomId, string roomName)
        {
            string? userId = Context.User!.FindFirstValue(ClaimTypes.NameIdentifier);
            string? userName = _db.Users.FirstOrDefault(_ => _.Id == userId)!.UserName;

            await Clients.All.SendAsync("ReceiveAddRoomMessage", maxRoom, roomId, roomName, userId, userName);
        }

        public async Task SendDeleteRoomMessage(int deleted, int selected, string roomName)
        {
            string? userId = Context.User!.FindFirstValue(ClaimTypes.NameIdentifier);
            string? userName = _db.Users.FirstOrDefault(_ => _.Id == userId)!.UserName;

            await Clients.All.SendAsync("ReceiveDeleteRoomMessage", deleted, selected, roomName, userId, userName);
        }

        public async Task SendPublicMessage(int roomId, string message, string roomName)
        {
            string? userId = Context.User!.FindFirstValue(ClaimTypes.NameIdentifier);
            string? userName = _db.Users.FirstOrDefault(_ => _.Id == userId)!.UserName;

            await Clients.All.SendAsync("ReceivePublicMessage", roomId, userId, userName, message, roomName);
        }

        public async Task SendPrivateMessage(string receiverId, string message, string receiverName)
        {
            string? senderId = Context.User!.FindFirstValue(ClaimTypes.NameIdentifier);
            string? senderName = _db.Users.FirstOrDefault(_ => _.Id == senderId)!.UserName;

            var users = new string[] { senderId!, receiverId };

            await Clients.Users(users).SendAsync("ReceivePrivateMessage", senderId, senderName, receiverId, message, Guid.NewGuid(), receiverName);
        }

        public async Task SendOpenPrivateChat(string receiverId)
        {
            string? senderId = Context.User!.FindFirstValue(ClaimTypes.NameIdentifier);
            string? senderName = Context.User!.FindFirstValue(ClaimTypes.Name);

            await Clients.Users(receiverId).SendAsync("ReceiveOpenPrivateChat", senderId, senderName);
        }

        public async Task SendDeletePrivateChat(string chatId)
        {
            await Clients.All.SendAsync("ReceiveDeletePrivateChat", chatId);
        }
    }
}
