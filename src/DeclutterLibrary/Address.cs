using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace DeclutterLibrary
{

    public sealed class Address
	{
		[JsonProperty ("EmailAddress")]
		public EmailAddress EmailAddress { get; set; }
	}

}
