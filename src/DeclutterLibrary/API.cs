using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Windows.Foundation;

namespace DeclutterLibrary
{
    public sealed class API
    {
        public IAsyncOperation<IEnumerable<Message>> getDataAsync()
        {
            return getDataAsyncInternal().AsAsyncOperation();
        }

        internal async Task<IEnumerable<Message>> getDataAsyncInternal()
        {
            EmailReader reader = new EmailReader();
            var res = await reader.AuthenticateOutlookClientAsync("Mail");
            return await reader.GetEmailMessagesAsync(0, 100);
        }
    }
}
