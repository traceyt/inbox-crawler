using DeclutterLibrary;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Office365.Discovery;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.Security.Authentication.Web;
using Windows.Storage;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=402352&clcid=0x409

namespace DeClutter
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        //IEnumerable<Message> Emails;
        IEnumerable<KeyValuePair<string,int>> GroupEmails;
        API api;
        private string postAuthPage;

        public MainPage()
        {
            this.InitializeComponent();
            api = new API();
        }

        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            if (e.Parameter != null && e.Parameter is string && !string.IsNullOrWhiteSpace(e.Parameter as string))
            {
                postAuthPage = e.Parameter as string;
            }
        }

        private async void Button_Click(object sender, RoutedEventArgs e)
        {
            EmailReader emailReader = new EmailReader();
            var res = await emailReader.AuthenticateOutlookClientAsync("Mail");

            // Emails = await a.GetEmailMessagesAsync(1, 100);
            //Emails = await api.getDataAsync();
            GroupEmails = await emailReader.GroupEmailsBySenderAsync();
            UpdateView();
        }

        private async void Button_Logout_Click(object sender, RoutedEventArgs e)
        {
            EmailReader a = new EmailReader();
            var res = await a.CreateOutlookClientLogoutAsync("Mail");
        }

        private void UpdateView()
        {
            // update view
            mailListView.DataContext = GroupEmails; //Emails;

            // switch to list view
            loginView.Visibility = Visibility.Collapsed;
            mailListView.Visibility = Visibility.Visible;

            if (postAuthPage == "cloud")
            {
                this.Frame.Navigate(typeof(Visualizer));
                return;
            }
        }

        private void mailListView_ItemClick(object sender, ItemClickEventArgs e)
        {
            //Message obj = e.ClickedItem as Message;
            KeyValuePair<string, int>? kv = e.ClickedItem as KeyValuePair<string, int>?;

            string email = kv.Value.Key;

            this.Frame.Navigate(typeof(DetailPage), email);
        }
    }
}
