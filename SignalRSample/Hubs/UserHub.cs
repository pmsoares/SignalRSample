using Microsoft.AspNetCore.SignalR;

namespace SignalRSample.Hubs
{
    public class UserHub : Hub
    {
        public static int TotalViews { get; set; } = 0;

        public async Task NewWindowLoaded()
        {
            TotalViews++;
            //enviar atualizações para todos os clientes
            await Clients.All.SendAsync("updateTotalViews", TotalViews);
        }
    }
}
