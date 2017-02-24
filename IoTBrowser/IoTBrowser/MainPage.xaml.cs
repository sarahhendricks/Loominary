// Copyright (c) Microsoft. All rights reserved.

using System;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Input;

// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=402352&clcid=0x409

namespace IoTBrowser
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        public MainPage()
        {
            this.InitializeComponent();
            DoWebNavigate();
        }

        private void Go_Web_Click(object sender, RoutedEventArgs e)
        {
            DoWebNavigate();
        }

        private void DoWebNavigate()
        {
            try
            {
                webView.Navigate(new Uri("http://127.0.0.1:1337"));
                webView.NavigationCompleted += WebView_NavigationCompleted;
            }
            catch (Exception e)
            {
                System.Diagnostics.Debug.WriteLine("Error: " + e.Message);
                System.Diagnostics.Debug.WriteLine("Catching an error");
            }
        }

        // If the web browser starts looking for the page before the NodeJS server is up,
        // have it continue to refresh until we get a hit.
        private void WebView_NavigationCompleted(WebView sender, WebViewNavigationCompletedEventArgs args)
        {
            if (args.IsSuccess == true)
            {
                System.Diagnostics.Debug.WriteLine("Navigation to " + args.Uri.ToString() + " completed successfully.");
            }
            else
            {
                System.Diagnostics.Debug.WriteLine("Navigation to: " + args.Uri.ToString() +
                                       " failed with error " + args.WebErrorStatus.ToString());
                webView.Refresh();
            }
        }
    }
}
