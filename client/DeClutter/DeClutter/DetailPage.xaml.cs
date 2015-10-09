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
        IEnumerable<Message> Emails;

        public DetailPage()
        {
            this.InitializeComponent();
        }

        protected async override void OnNavigatedTo(NavigationEventArgs e)
        {
            base.OnNavigatedTo(e);
            //Message message = e.Parameter as Message;
            String email = e.Parameter as String;
            Debug.WriteLine("show detail: {0}", email); // message.Subject

            //messageBox.Text = email; // message.Subject;

            await getEmails(email);
        }

        private async Task getEmails(string email)
        {
            Emails = await EmailReader.Instance().GetEmailMessagesBySenderAsync(email);

            mailListView.DataContext = Emails;
        }

        private void Button_Click_Back(object sender, RoutedEventArgs e)
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
    }
}
