using System.Runtime.InteropServices;
using System;
using System.Diagnostics;
using System.Text;

using System.Reflection;
using System.IO;

namespace Node.Cleanup.API.Tools {
    public static class OS {
        public static bool IsWindows() =>
            RuntimeInformation.IsOSPlatform(OSPlatform.Windows);

        public static bool IsMacOS() =>
            RuntimeInformation.IsOSPlatform(OSPlatform.OSX);

        public static bool IsLinux() =>
            RuntimeInformation.IsOSPlatform(OSPlatform.Linux);

        public static string WhatIs() {
            var os = (OS.IsWindows() ? "win" : null) ??
                    (OS.IsMacOS() ? "mac" : null) ??
                    (OS.IsLinux() ? "gnu" : null);
            return os;
        }
    }

    public class Response {
        public int code { get; set; }
        public string stdout { get; set; }
        public string stderr { get; set; }
    }

    public enum Output {
        Hidden,
        Internal,
        External
    }

    public static class Shell {
        private static void Args(ref string fnm, ref string cmd, Output? output = Output.Hidden, string dir = "") {
            try {
                if (!String.IsNullOrEmpty(dir)) {
                    //dir.Exists("");
                }
                switch (OS.WhatIs()) {
                    case "win":
                        fnm = "cmd.exe";
                        if (!String.IsNullOrEmpty(dir)) {
                            dir = $" \"{dir}\"";
                        }
                        if (output == Output.External) {
                            cmd = $"{Directory.GetCurrentDirectory()}/cmd.win.bat \"{cmd}\"{dir}";
                        }
                        cmd = $"/c \"{cmd}\"";
                        break;
                    case "mac":
                        fnm = "/bin/bash";
                        if (!String.IsNullOrEmpty(dir)) {
                            dir = $" '{dir}'";
                        }
                        if (output == Output.External) {
                            cmd = $"sh {Directory.GetCurrentDirectory()}/cmd.mac.sh '{cmd}'{dir}";
                        }
                        cmd = $"-c \"{cmd}\"";
                        break;
                }
            } catch (Exception Ex) {
                Console.WriteLine(Ex.Message);
            }

        }

        public static Response Term(this string cmd, Output? output = Output.Hidden, string dir = "") {
            var result = new Response();
            var stderr = new StringBuilder();
            var stdout = new StringBuilder();
            try {
                string fnm = "";
                Args(ref fnm, ref cmd, output, dir);

                ProcessStartInfo startInfo = new ProcessStartInfo();
                startInfo.FileName = fnm;
                startInfo.Arguments = cmd;
                startInfo.RedirectStandardOutput = !(output == Output.External);
                startInfo.RedirectStandardError = !(output == Output.External);
                startInfo.UseShellExecute = false;
                startInfo.CreateNoWindow = !(output == Output.External);
                if (!String.IsNullOrEmpty(dir) && output != Output.External) {
                    startInfo.WorkingDirectory = dir;
                }

                using (Process process = Process.Start(startInfo)) {
                    switch (output) {
                        case Output.Internal:
                            //$"".fmNewLine();

                            while (!process.StandardOutput.EndOfStream) {
                                string line = process.StandardOutput.ReadLine();
                                stdout.AppendLine(line);
                                Console.WriteLine(line);
                            }

                            while (!process.StandardError.EndOfStream) {
                                string line = process.StandardError.ReadLine();
                                stderr.AppendLine(line);
                                Console.WriteLine(line);
                            }
                            break;
                        case Output.Hidden:
                            stdout.AppendLine(process.StandardOutput.ReadToEnd());
                            stderr.AppendLine(process.StandardError.ReadToEnd());
                            break;
                    }
                    process.WaitForExit();
                    result.stdout = stdout.ToString();
                    result.stderr = stderr.ToString();
                    result.code = process.ExitCode;
                }
            } catch (Exception Ex) {
                Console.WriteLine(Ex.Message);
            }
            return result;
        }
    }
}
