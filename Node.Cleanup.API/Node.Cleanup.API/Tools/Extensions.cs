using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Node.Cleanup.API {
    public static class Extensions {
        public static ObjectResult CheckForValidRequest(this object request, Controller controller, string requestMethod, string type) {
            if (request == null) {
                var objResult = new ObjectResult($"Unable to retrieve the request body from the {requestMethod} method, please make sure the JSON object model matches the type '{type}'");
                objResult.StatusCode = 400;
                return objResult;
            }
            return null;
        }
    }

}
