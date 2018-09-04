using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Node.Cleanup.API.DomainModels;
using Node.Cleanup.API.Hubs;
using Node.Cleanup.API.Services.Interfaces;
using Node.Cleanup.API.Tools;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;

namespace Node.Cleanup.API.Services {
    public class DirectoryService : IDirectoryService {

        public DirectoryService(IHubContext<DirectoryInfoHub> dirHub, ILoggerFactory Factory) {
            DiretoryInfoHub = dirHub;
            this.Logger = Factory.CreateLogger<DirectoryService>();
        }

        public IHubContext<DirectoryInfoHub> DiretoryInfoHub { get; }
        public ILogger Logger { get; }
        DirectoryModel directoryResult = new DirectoryModel();

        public bool ValidateDirectory(FolderRequest request) {
            Logger.LogInformation("Validating Directory...");
            var result = Directory.Exists(request.Path);

            if (result) {
                Logger.LogInformation($"Directory '{request.Path}' is valid");
            } else {
                Logger.LogError($"Directory '{request.Path}' is invallid");
                throw new Exception($"Directory '{request.Path}' is invallid");
            }

            return result;
        }


        private void DirSearch(string dir, DirectoryModel dm) {
            try {
                DiretoryInfoHub.Clients.All.SendAsync("ReportProgress", dir);
                foreach (string d in Directory.GetDirectories(dir)) {
                    var newDm = new DirectoryModel(d);
                    dm.Directories.Add(newDm);

                    if (d.ToLower().Contains("node_modules")) {
                        DiretoryInfoHub.Clients.All.SendAsync("ReportProgress", d);
                        // Iterate through its contents and get the file size
                        DirectoryInfo _dir = new DirectoryInfo(d);
                        var fileInfo = _dir.GetFiles("*", SearchOption.AllDirectories);
                        newDm.Files = fileInfo.Length;
                        foreach (var file in fileInfo) {
                            newDm.Size += file.Length;
                        }
                        dm.Size += newDm.Size;
                    } else {
                        DirectoryInfo _d = new DirectoryInfo(d);
                        var _fileInfo = _d.GetFiles("*", SearchOption.TopDirectoryOnly);
                        newDm.Files = _fileInfo.Length;
                        foreach (var file in _fileInfo) {
                            newDm.Size += file.Length;
                        }
                        dm.Size += newDm.Size;

                        DirSearch(d, newDm);
                    }
                }

            } catch (System.Exception ex) {
                Console.WriteLine(ex.Message);
            }
        }

        public DirectoryModel AnalyseDirectory(FolderRequest request) {
            Logger.LogInformation($"Analyzing Directory '{request.Path}'...");

            if (ValidateDirectory(request)) {
                directoryResult = new DirectoryModel(request.Path);
                DirSearch(request.Path, directoryResult);
            }

            Logger.LogInformation($"Directory analyzed successfully");

            return directoryResult;
        }

        public bool DeleteDirectories(FoldersRequest directories) {

            Logger.LogInformation($"Deleting {directories.Paths.Count} Director{(directories.Paths.Count == 1 ? "y" : "ies")}");

            if (directories == null || directories.Paths == null || directories.Paths.Count == 0) {
                Logger.LogInformation($"No Directories specified.");
                return false;
            }

            List<Task> tasks = new List<Task>();

            var remainingDirectories = directories.Paths.Count;

            directories.Paths.ForEach(dir => {
                var task = new Task(new Action(() => {
                    DiretoryInfoHub.Clients.All.SendAsync("ReportProgress", $"Remaining Directories: {remainingDirectories--}");
                    deleteDirectory(dir);
                }));
                task.Start();
                tasks.Add(task);
            });

            Task.WaitAll(tasks.ToArray());

            return false;
        }

        private bool deleteDirectory(string path) {
            if (validatePath(path)) {
                Logger.LogInformation($"Deleting Directory '{path}' via Rimraf...");

                var rimrafLoc = $@"{Directory.GetCurrentDirectory()}/vendors/rimraf/bin.js";
                Logger.LogInformation($"Using Rimraf Directory '{rimrafLoc}'");

                Process nodeProc = (from p in Process.GetProcesses()
                                   where p.ProcessName == "node"
                                   select p).FirstOrDefault();

                if (nodeProc == null) throw new Exception("Failed to find the process Node.exe - Required to execute the rimraf command");

                var nodeLoc = nodeProc.MainModule.FileName;

                string strCmdText = $"\"{nodeLoc}\" \"{rimrafLoc}\" \"{path}\"";
                //System.Diagnostics.Process.Start("CMD.exe", strCmdText);

                try {
                    var result = Shell.Term(strCmdText);

                    if (result.code == 1) {
                        throw new Exception($"Execution failed - {result.stderr}");
                    }

                    //System.Diagnostics.Process process = new System.Diagnostics.Process();
                    //System.Diagnostics.ProcessStartInfo startInfo = new System.Diagnostics.ProcessStartInfo();
                    //startInfo.WindowStyle = System.Diagnostics.ProcessWindowStyle.Hidden;
                    ////startInfo.FileName = "cmd.exe";
                    //startInfo.Arguments = $"/C \"{strCmdText}\"";
                    ////startInfo.UseShellExecute = false;
                    //startInfo.RedirectStandardError = true;
                    //process.StartInfo = startInfo;

                    //Logger.LogInformation($"Executing CMD Commmand: '{startInfo.Arguments}'");

                    //process.Start();
                    ////process.BeginOutputReadLine();
                    //var msg = process.StandardError.ReadToEnd();
                    //process.WaitForExit();

                    //if (!string.IsNullOrEmpty(msg)) {
                    //    throw new Exception($"Failed to execute the command '{startInfo.Arguments}'", new Exception(msg));
                    //}

                    return true;
                } catch (Exception ex) {
                    throw new Exception("Failed to execute CMD Deletion Command", ex);
                }
            } else {
                throw new Exception($"Invalid Directory '{path}'");
            }
        }

        private bool validatePath(string path) {
            if (path != "" && path != @"/" && Directory.Exists(path)) return true;

            return false;
        }

        public bool DeleteDirectory(FolderRequest request) {
            return deleteDirectory(request.Path);
        }
    }
}
