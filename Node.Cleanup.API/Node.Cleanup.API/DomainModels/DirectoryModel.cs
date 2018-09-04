using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Node.Cleanup.API.DomainModels {
    public class DirectoryModel {

        public DirectoryModel() {

        }

        public DirectoryModel(string name) {
            var files = Directory.GetFiles(name);
            Name = Path.GetFileName(name);
            FullName = name;
            Files = files.Length;
            if (Files > 0) {
                DirectoryInfo dir = new DirectoryInfo(FullName);
                var fileInfo = dir.GetFiles("*", SearchOption.TopDirectoryOnly);
                foreach(var file in fileInfo) {
                    Size += file.Length;
                }
            }
        }

        public string FullName { get; set; }
        public string Name { get; set; }
        public int Files { get; set; }
        public long Size { get; set; }

        public List<DirectoryModel> Directories { get; set; } = new List<DirectoryModel>();

        public override string ToString() {
            return FullName;
        }
    }
}
