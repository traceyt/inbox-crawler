using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;

namespace DeclutterLibrary
{
    class MainClass
	{
		static JsonSerializerSettings settings = new JsonSerializerSettings {
			DateFormatHandling = DateFormatHandling.IsoDateFormat,
			DateTimeZoneHandling = DateTimeZoneHandling.Utc,
			DateParseHandling = DateParseHandling.DateTime
		};

		static JsonSerializer serializer = JsonSerializer.Create (settings);

		public static void SampleCall (string[] args)
		{
			JObject root = GetJsonObject<JObject> (new Uri ("https://outlook.office365.com/api/v1.0/me"), GetCredentials ()).Result; 

			foreach (JProperty prop in root.Properties()) {
				Debug.WriteLine ("{0}:{1}", prop.Name, prop.Value); 
			}

			var folders = EnumerateFolder ("https://outlook.office365.com/api/v1.0/me/folders").ToArray ();
			foreach (Folder folder in folders) {
				Debug.WriteLine ("{0}:{1}", folder.DisplayName, folder.ID); 
			}

			var map = new Dictionary<EmailAddress, Message> ();

			var inbox = folders.FirstOrDefault (f => f.DisplayName == "Inbox");
			DumpTopOffenders (inbox);

			var loPri = folders.FirstOrDefault (f => f.DisplayName == "Inbox Low Pri");
			DumpTopOffenders (loPri);
		}

		static void DumpTopOffenders (Folder folder)
		{
			string cacheName = folder.DisplayName + ".txt";

			var inboxMessageQuery = folder.ID + "/messages?$select=Sender,ToRecipients,CcRecipients,BccRecipients,Subject&$top=500";
			Message[] allMessages;
			if (!File.Exists (cacheName)) {
				allMessages = Enumerate<Message> (inboxMessageQuery).ToArray ();

                using (FileStream file = new FileStream(cacheName, FileMode.CreateNew))
                using (StreamWriter writer = new StreamWriter(file))
                {
                    serializer.Serialize(writer, allMessages);
                }

            }
            else
            {
                using (FileStream file = new FileStream(cacheName, FileMode.Open))
                using (StreamReader reader = new StreamReader (file))
                using (JsonReader jReader = new JsonTextReader(reader))
                {
                    allMessages = serializer.Deserialize<Message[]>(jReader);
                }
			}
			var topOffenders = allMessages.GroupBy (m => m.Sender.EmailAddress.Address).Select (g => new {
				Key = g.Key,
				Count = g.Count ()
			}).OrderByDescending (g => g.Count);
			int index = 0;
			foreach (var offender in topOffenders) {
				Debug.WriteLine ("{0}:{1} ({2})", index++, offender.Key, offender.Count);
			}
		}

		static IEnumerable<Folder> EnumerateFolder (string folderUrl)
		{
			foreach (var folder in Enumerate<Folder>(folderUrl)) {
				if (folder.ChildFolderCount > 0) {
					Debug.WriteLine ("Expanding {0}", folder.ID);
					folder.ChildFolders = EnumerateFolder (folder.ID + "/ChildFolders").ToArray ();
				}

				yield return folder;
			}
		}

		static IEnumerable<TObject> Enumerate<TObject> (string folderUrl)
		{
			Queue<string> queue = new Queue<string> ();
			queue.Enqueue (folderUrl);

			while (queue.Count > 0) {
				var uri = queue.Dequeue ();
				Debug.WriteLine (uri);
				var response = GetJsonObject<PageableResponse<TObject>> (new Uri (uri), GetCredentials ()).Result; 
		
				foreach (var item in response.Items) {
					yield return item;
				}

				if (response.NextLink != null) {
					queue.Enqueue (response.NextLink);
				}
			}
		}

		static NetworkCredential GetCredentials ()
		{
			NetworkCredential credentials = new NetworkCredential ();
			credentials.UserName = "stephbu@microsoft.com";
			credentials.Password = "*******";

			return credentials;
		}

		async static Task<T> GetJsonObject<T> (Uri url, ICredentials creds)
		{
			T obj;
			HttpWebRequest req = (HttpWebRequest)WebRequest.Create (url);
			req.Credentials = creds;
			using (var response = await req.GetResponseAsync())
			using (var responseStream = response.GetResponseStream())
			using (var streamReader = new StreamReader (responseStream))
			using (var jsonReader = new JsonTextReader (streamReader)) {
				obj = serializer.Deserialize<T> (jsonReader);
			}
			return obj;
		}
	}
}
