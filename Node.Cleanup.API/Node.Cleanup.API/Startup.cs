using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Node.Cleanup.API.Hubs;
using Node.Cleanup.API.Services;
using Node.Cleanup.API.Services.Interfaces;

namespace Node.Cleanup.API {
    public class Startup {

        ILogger Logger { get; }

        public Startup(IHostingEnvironment env) {
            Logger = initializeLogger();
            Logger.LogInformation("Building Application Configurations.");

            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("hosting.json", optional: true, reloadOnChange: true);

            Logger.LogInformation($"Using Environment: '{env.EnvironmentName}'");
            Logger.LogInformation($"Root Path: '{env.ContentRootPath}'");

            Logger.LogInformation($"Adding JSON File: 'appsettings.json'");
            builder.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
            builder.AddEnvironmentVariables();

            Configuration = builder.Build();
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add seFrvices to the container.
        public void ConfigureServices(IServiceCollection services) {
            addCORS(services);
            injectServices(services);

            services.AddSignalR();
            services.AddMvc();
        }

        private static void addCORS(IServiceCollection services) {
            services.AddCors(options => {
                options.AddPolicy("AllowAll",
                    builder => {
                        builder
                        .AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials();
                    });
            });
        }

        /// <summary>
        /// Dependency Injection here
        /// </summary>
        private void injectServices(IServiceCollection services) {
            services.AddScoped<IDirectoryService, DirectoryService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env) {
            if (env.IsDevelopment()) {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors("AllowAll");

            app.UseSignalR(routes => {
                routes.MapHub<Hubs.DirectoryInfoHub>("/directoryInfo");
            });

            app.UseMvc();
        }

        private ILogger initializeLogger() {
            var LoggerFactory = new LoggerFactory();
            LoggerFactory.AddDebug();
            LoggerFactory.AddConsole(LogLevel.Trace);
            var Logger = LoggerFactory.CreateLogger<Startup>();

            Logger.LogInformation("------------------------------------------------------------------------------------------------------");
            Logger.LogInformation("Core Starting.");
            Logger.LogInformation($"Operating System: { RuntimeInformation.OSDescription }");
            Logger.LogInformation($"OS Architecture: { RuntimeInformation.OSArchitecture }");
            Logger.LogInformation($"Process Architecture: { RuntimeInformation.ProcessArchitecture }");
            Logger.LogInformation($"Framework: { RuntimeInformation.FrameworkDescription }");
            Logger.LogInformation("------------------------------------------------------------------------------------------------------");

            return Logger;
        }
    }
}
