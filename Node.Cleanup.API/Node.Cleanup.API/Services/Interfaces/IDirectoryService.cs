using Node.Cleanup.API.DomainModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Node.Cleanup.API.Services.Interfaces {
    public interface IDirectoryService {

        bool ValidateDirectory(FolderRequest request);
        DirectoryModel AnalyseDirectory(FolderRequest request);
        bool DeleteDirectory(FolderRequest request);
        bool DeleteDirectories(FoldersRequest request);
    }
}
