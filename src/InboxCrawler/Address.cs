using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace InboxCrawler
{

    class Address
	{
		[JsonProperty ("EmailAddress")]
		public EmailAddress EmailAddress { get; set; }
	}

}
