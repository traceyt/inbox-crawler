using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace InboxCrawler
{

    class PageableResponse<TObject>
	{
		[JsonProperty ("@odata.context")]
		public string Context { get; set; }

		[JsonProperty ("value")]
		public List<TObject> Items { get; set; }

		[JsonProperty ("@odata.nextLink")]
		public string NextLink { get; set; }
	}
	
}
