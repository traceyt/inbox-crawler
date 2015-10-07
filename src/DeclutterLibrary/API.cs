using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace DeclutterLibrary
{

    public sealed class API
    {

        static JsonSerializerSettings settings = new JsonSerializerSettings
        {
            DateFormatHandling = DateFormatHandling.IsoDateFormat,
            DateTimeZoneHandling = DateTimeZoneHandling.Utc,
            DateParseHandling = DateParseHandling.DateTime
        };

        static JsonSerializer serializer = JsonSerializer.Create(settings);

        public IEnumerable<Message> GetData(string token, string folderName)
        {
            var folders = EnumerateFolder("https://outlook.office365.com/api/v1.0/me/folders").ToArray();
            var folder = folders.FirstOrDefault(f => f.DisplayName == folderName);

            if (folder == null)
            {
                throw new NullReferenceException("Folder not found");
            }

            var inboxMessageQuery = folder.ID + "/messages?$select=Sender,ToRecipients,CcRecipients,BccRecipients,Subject&$top=500";

            return Enumerate<Message>(inboxMessageQuery).ToArray();
        }

        static IEnumerable<Folder> EnumerateFolder(string folderUrl)
        {
            foreach (var folder in Enumerate<Folder>(folderUrl))
            {
                if (folder.ChildFolderCount > 0)
                {
                    folder.ChildFolders = EnumerateFolder(folder.ID + "/ChildFolders").ToArray();
                }

                yield return folder;
            }
        }

        static IEnumerable<TObject> Enumerate<TObject>(string folderUrl)
        {
            Queue<string> queue = new Queue<string>();
            queue.Enqueue(folderUrl);

            while (queue.Count > 0)
            {
                var uri = queue.Dequeue();
                var response = GetJsonObject<PageableResponse<TObject>>(new Uri(uri), GetCredentials()).Result;

                foreach (var item in response.Items)
                {
                    yield return item;
                }

                if (response.NextLink != null)
                {
                    queue.Enqueue(response.NextLink);
                }
            }
        }


        async static Task<T> GetJsonObject<T>(Uri url, ICredentials creds)
        {
            T obj;
            HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);
            req.Credentials = creds;
            using (var response = await req.GetResponseAsync())
            using (var responseStream = response.GetResponseStream())
            using (var streamReader = new StreamReader(responseStream))
            using (var jsonReader = new JsonTextReader(streamReader))
            {
                obj = serializer.Deserialize<T>(jsonReader);
            }
            return obj;
        }
 
        static NetworkCredential GetCredentials()
        {
            NetworkCredential credentials = new NetworkCredential();
            credentials.UserName = "stephbu@microsoft.com";
            credentials.Password = "****";

            return credentials;
        }
    }
}
