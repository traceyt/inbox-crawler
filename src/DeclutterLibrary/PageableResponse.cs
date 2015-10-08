using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace DeclutterLibrary
{

    class PageableResponse<TObject>
	{
		[JsonProperty ("@odata.context")]
		public string Context { get; set; }

		[JsonProperty ("value")]
		public IEnumerable<TObject> Items { get; set; }

		[JsonProperty ("@odata.nextLink")]
		public string NextLink { get; set; }
	}
	
}
