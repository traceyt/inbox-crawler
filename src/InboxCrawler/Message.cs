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
