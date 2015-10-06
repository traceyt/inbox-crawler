using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
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
