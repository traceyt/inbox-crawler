using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace DeclutterLibrary
{
    public sealed class EmailAddress
	{
		public int Compare (EmailAddress x, EmailAddress y)
		{
			return x.Address.CompareTo (y.Address);
		}

		[JsonProperty ("Address")]
		public string Address { get; set; }

		[JsonProperty ("Name")]
		public string Name { get; set; }
	}

    internal class EmailComparer : IComparer<EmailAddress>
    {
        public int Compare(EmailAddress x, EmailAddress y)
        {
            return x.Address.CompareTo(y.Address);
        }
    }
}
