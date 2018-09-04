using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Node.Cleanup.API.Hubs {
    public class DirectoryInfoHub: Hub {
        public ILogger Logger { get; }

        public DirectoryInfoHub(ILoggerFactory factory) {
            Logger = factory.CreateLogger<DirectoryInfoHub>();
        }

        public async Task ReportProgress(string message, int progress) {
            await Clients.All.SendAsync("ReportProgress", message, progress);
        }


        public override Task OnConnectedAsync() {
            Logger.LogDebug("Client Connected");
            return base.OnConnectedAsync();
        }
    }
}
