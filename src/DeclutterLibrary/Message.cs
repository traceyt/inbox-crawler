using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace DeclutterLibrary
{

    public class Message
	{
		[JsonProperty ("Sender")]
		public Address Sender { get; set; }

		[JsonProperty ("ToRecipients")]
		public IEnumerable<Address> To { get; set; }

		[JsonProperty ("CcRecipients")]
		public IEnumerable<Address> Cc { get; set; }

		[JsonProperty ("BccRecipients")]
		public IEnumerable<Address> Bcc { get; set; }

		[JsonProperty ("DateTimeReceived")]
		public DateTime DateTimeReceived { get; set; }

		[JsonProperty ("Subject")]
		public string Subject { get; set; }
	}
	
}
