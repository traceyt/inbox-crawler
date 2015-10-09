using DeClutter.Helper;
using DeclutterLibrary;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Popups;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=234238

namespace DeClutter
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class DetailPage : Page
    {
        IEnumerable<Message> emails;

        public DetailPage()
        {
            this.InitializeComponent();
        }

        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            base.OnNavigatedTo(e);
            
            // Handle navigation parameter object
            String email = e.Parameter as String;
            Debug.WriteLine("Detail page: {0}", email);

            // Update page title
            pageTitle.Text = email;

            GetEmails(email);
        }

        private async void GetEmails(string email)
        {
            emails = await EmailReader.Instance().GetEmailMessagesBySenderAsync(email);

            // Bind emails to ListView
            if(emails != null)
            {
                mailListView.DataContext = emails;
            } else
            {
                await Alert.Error("No emails found");
            }
        }

        private void BackButton_Click(object sender, RoutedEventArgs e)
        {
            if (this.Frame.CanGoBack)
            {
                this.Frame.GoBack();
            }
            else
            {
                Debug.WriteLine("Error. Can't go back!");
            }
        }

        private async void AppBarButtonMove_Click(object sender, RoutedEventArgs e)
        {
            await Alert.Show("Move emails to folder not implemented");
        }

        private async void AppBarButtonNew_Click(object sender, RoutedEventArgs e)
        {
            await Alert.Show("Move emails into new folder not implemented");
        }

        private async void AppBarButtonRead_Click(object sender, RoutedEventArgs e)
        {
            await Alert.Show("Mark emails as read not implemented");
        }

        private async void AppBarButtonDelete_Click(object sender, RoutedEventArgs e)
        {
            await Alert.Show("Delete emails not implemented");
        }
    }
}
