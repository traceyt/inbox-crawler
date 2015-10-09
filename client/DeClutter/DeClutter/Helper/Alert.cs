using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Popups;

namespace DeClutter.Helper
{
    public static class Alert
    {
        public static async Task Show(String message)
        {
            MessageDialog alert = new MessageDialog(message);
            await alert.ShowAsync();
        }

        public static async Task Show(String message, String title)
        {
            MessageDialog alert = new MessageDialog(message, title);
            await alert.ShowAsync();
        }

        public static async Task Error(String message)
        {
            await Show(message, "Error");
        }
    }
}
