using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Office365.Discovery;
using Microsoft.Office365.OutlookServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.Storage;
using Windows.UI.Xaml;

namespace DeclutterLibrary
{
    public sealed class EmailReader 
    {
        public static AuthenticationContext _authenticationContext { get; set; }

        private string ClientID = Application.Current.Resources["ida:ClientID"] as String;
        // Get the _returnUri from app settings.
        private static Uri _returnUri = Windows.Security.Authentication.Web.WebAuthenticationBroker.GetCurrentApplicationCallbackUri();

        // Properties used to communicate with a Windows Azure AD tenant.  
        private const string CommonAuthority = "https://login.microsoftonline.com/common";
        private const string DiscoveryResourceId = "https://api.office.com/discovery/";

        //Store authority in application data so that it isn't tied to the lifetime of the access token.
        private static ApplicationDataContainer _settings = ApplicationData.Current.LocalSettings;

        private OutlookServicesClient _outLookClient;

        private static string LastAuthority
        {
            get
            {
                if (_settings.Values.ContainsKey("LastAuthority") && _settings.Values["LastAuthority"] != null)
                {
                    return _settings.Values["LastAuthority"].ToString();
                }
                else
                {
                    return string.Empty;
                }
            }
            set
            {
                _settings.Values["LastAuthority"] = value;
            }
        }

        public IAsyncOperation<bool> AuthenticateOutlookClientAsync(string capability)
        {
            return CreateOutlookClientAsyncInternal(capability).AsAsyncOperation<bool>();
        }

        public IAsyncOperation<IEnumerable<Message>> GetEmailMessagesAsync(int pageNo, int pageSize)
        {
            return GetEmailMessagesInternalAsync(pageNo, pageSize).AsAsyncOperation<IEnumerable<Message>>();
        }

        internal async Task<string> GetTokenHelperAsync(AuthenticationContext context, string resourceId)
        {
            string accessToken = null;
            AuthenticationResult result = null;

            result = await context.AcquireTokenAsync(resourceId, ClientID, _returnUri);

            accessToken = result.AccessToken;

            _settings.Values["LastAuthority"] = context.Authority;

            return accessToken;
        }

        internal async Task<bool> CreateOutlookClientAsyncInternal(string capability)
        {
            try
            {
                //First, look for the authority used during the last authentication.
                //If that value is not populated, use CommonAuthority.
                string authority = null;
                if (String.IsNullOrEmpty(LastAuthority))
                {
                    authority = CommonAuthority;
                }
                else
                {
                    authority = LastAuthority;
                }

                // Create an AuthenticationContext using this authority.
                _authenticationContext = new AuthenticationContext(authority);
                
                DiscoveryClient discoveryClient = new DiscoveryClient(
                    async () => await GetTokenHelperAsync(_authenticationContext, DiscoveryResourceId));

                // Get the specified capability ("Calendar").
                CapabilityDiscoveryResult result =
                    await discoveryClient.DiscoverCapabilityAsync(capability);
                var client = new OutlookServicesClient(
                    result.ServiceEndpointUri,
                    async () =>
                        await GetTokenHelperAsync(_authenticationContext, result.ServiceResourceId));
                _outLookClient = client;
                return true;
            }
            catch (Exception ex)
            {
                if (_authenticationContext != null && _authenticationContext.TokenCache != null)
                    _authenticationContext.TokenCache.Clear();
                _outLookClient = null;
                return false;
            }
        }

        internal async Task<IEnumerable<Message>> GetEmailMessagesInternalAsync(int pageNo, int pageSize)
        {
            var mailResults = await (from i in _outLookClient.Me.Folders.GetById("Inbox").Messages
                                     orderby i.DateTimeReceived descending
                                     select i).Skip((pageNo) * pageSize).Take(pageSize).ExecuteAsync();

            List<Message> emailList = new List<Message>();

            foreach (var message in mailResults.CurrentPage)
            {
                emailList.Add(new Message {
                    ID = message.Id,
                    To = message.ToRecipients.Select(r => new Address { EmailAddress = new EmailAddress { Address = r.EmailAddress.Address, Name = r.EmailAddress.Name } }).ToArray(),
                    Cc = message.CcRecipients.Select(r => new Address { EmailAddress = new EmailAddress { Address = r.EmailAddress.Address, Name = r.EmailAddress.Name } }).ToArray(),
                    Bcc = message.BccRecipients.Select(r => new Address { EmailAddress = new EmailAddress { Address = r.EmailAddress.Address, Name = r.EmailAddress.Name } }).ToArray(),
                    Subject = message.Subject,
                    Sender = new Address {
                        EmailAddress = new EmailAddress { Address = message.Sender.EmailAddress.Address, Name = message.Sender.EmailAddress.Name }
                    },
                    DateTimeReceived = message.DateTimeReceived == null ? DateTimeOffset.MinValue : message.DateTimeReceived.Value
                });
            }

            return emailList;
        }
        public IAsyncOperation<IEnumerable<KeyValuePair<string, int>>> GroupEmailsBySenderAsync()
        {
            return GroupEmailsBySenderAsyncInternal().AsAsyncOperation<IEnumerable<KeyValuePair<string, int>>>();
        }

        /// <summary>
        /// Groups emails by sender 
        /// </summary>
        /// <returns></returns>
        internal async Task<IEnumerable<KeyValuePair<string, int>>> GroupEmailsBySenderAsyncInternal()
        {

            bool continueReading = true;
            int pageCounter = 0;
            Dictionary<string, int> dictionary = new Dictionary<string, int>();

            while (continueReading)
            {
                var list = await GetEmailMessagesInternalAsync(pageCounter, 100);

                if (list != null && list.Count() > 0)
                {
                    foreach (var item in list)
                    {
                        dictionary[item.Sender.EmailAddress.Address] =
                            dictionary.ContainsKey(item.Sender.EmailAddress.Address) ?
                            dictionary[item.Sender.EmailAddress.Address] + 1 : 1;
                    }
                }
                else
                {
                    continueReading = false;
                }

                pageCounter++;
            }

            var items = from pair in dictionary
                        orderby pair.Value ascending
                        select pair;

            return items.AsEnumerable();

        }
        public IAsyncOperation<IEnumerable<Message>> GetEmailMessagesBySenderAsync(string sender)
        {
            return GetEmailMessagesBySenderInternalAsync(sender).AsAsyncOperation<IEnumerable<Message>>();
        }

        internal async Task<IEnumerable<Message>> GetEmailMessagesBySenderInternalAsync(string sender)
        {
            var mailResults = await _outLookClient.Me.Folders.GetById("Inbox").Messages.
                Where(i => i.Sender.EmailAddress.Address == sender).ExecuteAsync();

           List<Message> emailList = new List<Message>();

            foreach (var message in mailResults.CurrentPage)
            {
                emailList.Add(new Message
                {
                    ID = message.Id,
                    To = message.ToRecipients.Select(r => new Address { EmailAddress = new EmailAddress { Address = r.EmailAddress.Address, Name = r.EmailAddress.Name } }).ToArray(),
                    Cc = message.CcRecipients.Select(r => new Address { EmailAddress = new EmailAddress { Address = r.EmailAddress.Address, Name = r.EmailAddress.Name } }).ToArray(),
                    Bcc = message.BccRecipients.Select(r => new Address { EmailAddress = new EmailAddress { Address = r.EmailAddress.Address, Name = r.EmailAddress.Name } }).ToArray(),
                    Subject = message.Subject,
                    Sender = new Address
                    {
                        EmailAddress = new EmailAddress { Address = message.Sender.EmailAddress.Address, Name = message.Sender.EmailAddress.Name }
                    },
                    DateTimeReceived = message.DateTimeReceived == null ? DateTimeOffset.MinValue : message.DateTimeReceived.Value
                });
            }

            return emailList;
        }
    }
}
