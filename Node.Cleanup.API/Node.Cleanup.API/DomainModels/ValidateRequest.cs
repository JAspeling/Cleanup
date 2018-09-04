using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Node.Cleanup.API.DomainModels {
    public class FolderRequest {
        public string Path { get; set; }
    }

    public class FoldersRequest {
        public List<string> Paths { get; set; } = new List<string>();
    }
}
