using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace InboxCrawler
{

    class Folder
	{
		[JsonProperty ("@odata.id")]
		public string ID { get; set; }

		[JsonProperty ("DisplayName")]
		public string DisplayName { get; set; }

		[JsonProperty ("ParentFolderID")]
		public string ParentFolderID { get; set; }

		[JsonProperty ("ChildFolderCount")]
		public int ChildFolderCount { get; set; }

		public IEnumerable<Folder> ChildFolders { get; set; }

		public override string ToString ()
		{
			return this.DisplayName;
		}
	}
}
