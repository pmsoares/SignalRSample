using Microsoft.AspNetCore.SignalR;

namespace SignalRSample.Hubs
{
    public class UserHub : Hub
    {
        public static int TotalViews { get; set; } = 0;

        public static int TotalUsers { get; set; } = 0;

        public async Task<string> NewWindowLoaded(string name)
        {
            TotalViews++;
            //enviar atualizações para todos os clientes
            await Clients.All.SendAsync("updateTotalViews", TotalViews);
            return $"Total views from {name} - {TotalViews}";
        }

        public override Task OnConnectedAsync()
        {
            TotalUsers++;
            Clients.All.SendAsync("updateTotalUsers", TotalUsers).GetAwaiter().GetResult();
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            TotalUsers--;
            Clients.All.SendAsync("updateTotalUsers", TotalUsers).GetAwaiter().GetResult();
            return base.OnDisconnectedAsync(exception);
        }
    }
}
