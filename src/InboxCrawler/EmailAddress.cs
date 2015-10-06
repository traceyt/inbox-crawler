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

	class EmailAddress : IComparer<EmailAddress>
	{
		public override bool Equals (object obj)
		{
			if (obj is EmailAddress) {
				EmailAddress em = obj as EmailAddress;
				return this.Address.Equals (em.Address);
			}
			return base.Equals (obj);
		}

		public int Compare (EmailAddress x, EmailAddress y)
		{
			return x.Address.CompareTo (y.Address);
		}

		[JsonProperty ("Address")]
		public string Address { get; set; }

		[JsonProperty ("Name")]
		public string Name { get; set; }
	}
	
}
