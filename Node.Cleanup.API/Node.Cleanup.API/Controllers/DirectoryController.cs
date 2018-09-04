using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Node.Cleanup.API.DomainModels;
using Node.Cleanup.API.Services.Interfaces;

namespace Node.Cleanup.API.Controllers {
    [Route("api/[controller]")]
    public class DirectoryController : Controller {
        public IDirectoryService DirectoryService { get; }
        public ILogger Logger { get; }

        public DirectoryController(IDirectoryService directoryService, ILoggerFactory factory) {
            DirectoryService = directoryService;
            Logger = factory.CreateLogger<DirectoryController>();
        }

        // GET: api/Directory
        [HttpGet]
        public IEnumerable<string> Get() {
            return new string[] { "value1", "value2" };
        }

        [HttpPost("Validate")]
        public IActionResult Validate([FromBody]FolderRequest request) {
            try {
                var res = request.CheckForValidRequest(this, HttpContext.Request.Method, typeof(FolderRequest).Name);
                if (res?.StatusCode == 400) return res;

                var result = this.DirectoryService.ValidateDirectory(request);

                return Ok(result);
            } catch (Exception ex) {
                var _ex = new Exception("Failed to validate the Path", ex);
                Logger.LogError(ex.Message, ex);
                return StatusCode(500, _ex);
            }
        }

        [HttpPost("Analyze")]
        public IActionResult Analyze([FromBody]FolderRequest request) {
            try {
                var res = request.CheckForValidRequest(this, HttpContext.Request.Method, typeof(FolderRequest).Name);
                if (res?.StatusCode == 400) return res;

                var directoryResult = this.DirectoryService.AnalyseDirectory(request);
                return Ok(directoryResult);
            } catch (Exception ex) {
                var _ex = new Exception("Failed to Analyze the Path", ex);
                Logger.LogError(ex.Message, ex);
                return StatusCode(500, _ex);
            }
        }

        [HttpPost("Delete")]
        public IActionResult Delete([FromBody]FolderRequest request) {
            try {
                var res = request.CheckForValidRequest(this, HttpContext.Request.Method, typeof(FolderRequest).Name);
                if (res?.StatusCode == 400) return res;

                var directoryResult = this.DirectoryService.DeleteDirectory(request);
                return Ok(directoryResult);
            } catch (Exception ex) {
                var _ex = new Exception("Failed to Delete the Directory", ex);
                Logger.LogError(ex.Message, ex);
                return StatusCode(500, _ex);
            }
        }

        [HttpPost("DeleteMultiple")]
        public IActionResult DeleteMultiple([FromBody]FoldersRequest request) {
            try {
                var res = request.CheckForValidRequest(this, HttpContext.Request.Method, typeof(FolderRequest).Name);
                if (res?.StatusCode == 400) return res;

                var directoryResult = this.DirectoryService.DeleteDirectories(request);
                return Ok(directoryResult);
            } catch (Exception ex) {
                var _ex = new Exception("Failed to Delete the Directories", ex);
                Logger.LogError(ex.Message, ex);
                return StatusCode(500, _ex);
            }
        }
    }
}
