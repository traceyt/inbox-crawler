using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace DeclutterLibrary
{
    public sealed class API
    {
        public async Task<IEnumerable<Message>> getDataAsync()
        {
            EmailReader reader = new EmailReader();
            var res = await reader.AuthenticateOutlookClientAsync("Mail");
            return await reader.GetEmailMessagesAsync(0, 100);
        }
    }
}
