using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace InboxCrawler
{

    class Message
	{
		[JsonProperty ("Sender")]
		public Address Sender { get; set; }

		[JsonProperty ("ToRecipients")]
		public List<Address> To { get; set; }

		[JsonProperty ("CcRecipients")]
		public List<Address> Cc { get; set; }

		[JsonProperty ("BccRecipients")]
		public List<Address> Bcc { get; set; }

		[JsonProperty ("DateTimeReceived")]
		public DateTime DateTimeReceived { get; set; }

		[JsonProperty ("Subject")]
		public string Subject { get; set; }
	}
	
}
