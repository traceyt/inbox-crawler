using DeClutter.Helper;
using DeclutterLibrary;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.Foundation;
using Windows.Foundation.Collections;
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
        private EmailReader emailReader; // API api;
        private IEnumerable<KeyValuePair<string,int>> groupEmails; //IEnumerable<Message> Emails;

        private string postAuthPage;

        public MainPage()
        {
            this.InitializeComponent();

            // Init emailReader
            if (emailReader == null)
            {
                EmailReader emailReader = new EmailReader();
            }
        }

        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            if (e.Parameter != null && e.Parameter is string && !string.IsNullOrWhiteSpace(e.Parameter as string))
            {
                postAuthPage = e.Parameter as string;
            }
        }

        private async void LoginButton_Click(object sender, RoutedEventArgs e)
        {
            // Initiate login popup
            var result = await EmailReader.Instance().AuthenticateOutlookClientAsync("Mail");

            if (result)
            {
                groupEmails = await EmailReader.Instance().GroupEmailsBySenderAsync();
                UpdateView();
            }
            else
            {
                await Alert.Error("Opps, could not signin. Please try again");
            }
        }

        private void UpdateView()
        {
            // Populate ListView with grouped emails
            mailListView.DataContext = groupEmails;

            // Display List View
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
            // Get email value from selected list item object
            KeyValuePair<string, int>? kvp = e.ClickedItem as KeyValuePair<string, int>?; //Message obj = e.ClickedItem as Message;
            string email = kvp.Value.Key;

            // Navigate to Detail Page and show list of emails from sender
            this.Frame.Navigate(typeof(DetailPage), email);
        }
    }
}
